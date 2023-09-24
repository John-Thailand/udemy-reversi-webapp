import express from 'express'
import { TurnService } from '../application/service/turnService'
import { Point } from '../domain/model/turn/point'
import { toDisc } from '../domain/model/turn/disc'

export const turnRouter = express.Router()

const turnService = new TurnService()

interface TurnGetResponseBody {
    turnCount: number
    board: number[][]
    nextDisc: number | null
    winnerDisc: number | null
}

// 各RouterはPresentation層に該当する
// Presentation層の役割はこのアプリケーションの利用者とやり取りすること
// 例：リクエストからパラメータを取り出したり、レスポンスを返すこと
turnRouter.get('/api/games/latest/turns/:turnCount', async (req, res: express.Response<TurnGetResponseBody>) => {
    // リクエストからパラメータを取り出す
    const turnCount = parseInt(req.params.turnCount)

    const output = await turnService.findLatestGameTurnByTurnCount(turnCount)

    const responseBody = {
        turnCount: output.turnCount,
        board: output.board,
        nextDisc: output.nextDisc ?? null,
        winnerDisc: output.winnerDisc ?? null
    }

    // レスポンスを返す
    res.json(responseBody)
})

interface TurnPostRequestBody {
    turnCount: number
    move: {
        disc: number
        x: number
        y: number
    }
}

// 各RouterはPresentation層に該当する
// Presentation層の役割はこのアプリケーションの利用者とやり取りすること
// 例：リクエストからパラメータを取り出したり、レスポンスを返すこと
turnRouter.post('/api/games/latest/turns', async (req: express.Request<{}, {}, TurnPostRequestBody>, res) => {
    // リクエストからパラメータを取り出す
    const turnCount = req.body.turnCount
    const disc = toDisc(req.body.move.disc)
    const point = new Point(req.body.move.x, req.body.move.y)

    await turnService.registerTurn(turnCount, disc, point)

    res.status(201).end()
})