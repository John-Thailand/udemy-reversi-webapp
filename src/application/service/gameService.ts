import { connectMySQL } from '../../infrastructure/connection'
import { firstTurn } from '../../domain/model/turn/turn'
import { Game } from '../../domain/model/game/game'
import { GameRepository } from '../../domain/model/game/gameRepository'
import { TurnRepository } from '../../infrastructure/repository/turn/turnRepository'

// GameServiceでドメイン層のGameRepositoryとTurnRepositoryのDIを行なっている
// これでGameMySQLRepositoryやTurnMySQLRepositoryなどのインタフェース層に依存しなくてよい

// サービスクラスはユースケース（処理の流れ）を実現するものであり、下記のようなコードは
// インフラ層のどのデータベースのテーブルにアクセスするかを定義したものであるので、
// 下記のコードをサービスクラスに記載するべきではない
// const gameRepository = new GameMySQLRepository()
// const turnRepository = new TurnMySQLRepository()

export class GameService {
    constructor(
        private _gameRepository: GameRepository,
        private _turnRepository: TurnRepository
    ) {}
    
    async startNewGame() {
        const now = new Date()

        const conn = await connectMySQL()
        try {
            await conn.beginTransaction()

            // ゲームを保存する
            const game = await this._gameRepository.save(conn, new Game(undefined, now))
            if (!game.id) {
                throw new Error('game.id not exist')
            }

            // 最初のターンをドメインモデルで生成する
            // 最初のターンとういう現実でも起こっていることを、
            // TurnやBoardドメインモデルで実現している
            const turn = firstTurn(game.id, now)

            // 最初のターンを保存する
            await this._turnRepository.save(conn, turn)

            await conn.commit()
        } finally {
            await conn.end()
        }
    }
}