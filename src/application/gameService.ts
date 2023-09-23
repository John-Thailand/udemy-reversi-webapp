import { GameGateway } from '../dataaccess/gameGateway'
import { connectMySQL } from '../dataaccess/connection'
import { TurnRepository } from '../domain/turnRepository'
import { firstTurn } from '../domain/turn'

const gameGateway = new GameGateway()
const turnRepository = new TurnRepository()

export class GameService {
    async startNewGame() {
        const now = new Date()

        const conn = await connectMySQL()
        try {
            await conn.beginTransaction()

            // ゲームを保存する
            const gameRecord = await gameGateway.insert(conn, now)

            // 最初のターンをドメインモデルで生成する
            // 最初のターンとういう現実でも起こっていることを、
            // TurnやBoardドメインモデルで実現している
            const turn = firstTurn(gameRecord.id, now)

            // 最初のターンを保存する
            await turnRepository.save(conn, turn)

            await conn.commit()
        } finally {
            await conn.end()
        }
    }
}