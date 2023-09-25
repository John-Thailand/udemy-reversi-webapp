import express from 'express'
import { GameService } from '../application/service/gameService'
import { GameMySQLRepository } from '../infrastructure/repository/game/gameMySQLRepository'
import { TurnMySQLRepository } from '../infrastructure/repository/turn/turnMySQLRepository'

export const gameRouter = express.Router()

const gameService = new GameService(
    new GameMySQLRepository(),
    new TurnMySQLRepository()
)

// 各RouterはPresentation層に該当する
// Presentation層の役割はこのアプリケーションの利用者とやり取りすること
// 例：リクエストからパラメータを取り出したり、レスポンスを返すこと
gameRouter.post('/api/games', async (req, res) => {
    await gameService.startNewGame()

    // レスポンスを返す
    res.status(201).end()
})