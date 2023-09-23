import express from 'express'
import { GameService } from '../application/gameService'

export const gameRouter = express.Router()

const gameService = new GameService()

// 各RouterはPresentation層に該当する
// Presentation層の役割はこのアプリケーションの利用者とやり取りすること
// 例：リクエストからパラメータを取り出したり、レスポンスを返すこと
gameRouter.post('/api/games', async (req, res) => {
    await gameService.startNewGame()

    // レスポンスを返す
    res.status(201).end()
})