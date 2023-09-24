import { connectMySQL } from '../../infrastructure/connection'
import { TurnRepository } from '../../domain/model/turn/turnRepository'
import { firstTurn } from '../../domain/model/turn/turn'
import { GameRepository } from '../../domain/model/game/gameRepository'
import { Game } from '../../domain/model/game/game'

const gameRepository = new GameRepository()
const turnRepository = new TurnRepository()

export class GameService {
    async startNewGame() {
        const now = new Date()

        const conn = await connectMySQL()
        try {
            await conn.beginTransaction()

            // ゲームを保存する
            const game = await gameRepository.save(conn, new Game(undefined, now))
            if (!game.id) {
                throw new Error('game.id not exist')
            }

            // 最初のターンをドメインモデルで生成する
            // 最初のターンとういう現実でも起こっていることを、
            // TurnやBoardドメインモデルで実現している
            const turn = firstTurn(game.id, now)

            // 最初のターンを保存する
            await turnRepository.save(conn, turn)

            await conn.commit()
        } finally {
            await conn.end()
        }
    }
}