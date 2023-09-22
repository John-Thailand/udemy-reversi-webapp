import { GameGateway } from '../dataaccess/gameGateway'
import { TurnGateway } from '../dataaccess/turnGateway'
import { SquareGateway } from '../dataaccess/squareGateway'
import { connectMySQL } from '../dataaccess/connection'
import { DARK, LIGHT } from './constants'
import { MoveGateway } from '../dataaccess/moveGateway'
import { toDisc } from '../domain/disc'
import { Board } from '../domain/board'
import { Turn } from '../domain/turn'
import { Point } from '../domain/point'
import { TurnRepository } from '../domain/turnRepository'

const gameGateway = new GameGateway()

const turnRepository = new TurnRepository()

class findLatestGameTurnByTurnCountOutput {
    constructor(
        private _turnCount: number,
        private _board: number[][],
        private _nextDisc: number | undefined,
        private _winnerDisc: number | undefined,
    ) {}

    get turnCount() {
        return this._turnCount
    }

    get board() {
        return this._board
    }

    get nextDisc() {
        return this._nextDisc
    }

    get winnerDisc() {
        return this._winnerDisc
    }
}

export class TurnService {
    async findLatestGameTurnByTurnCount(turnCount: number): Promise<findLatestGameTurnByTurnCountOutput> {
        const conn = await connectMySQL()
        try {
            const gameRecord = await gameGateway.findLatest(conn)
            if (!gameRecord) {
                throw new Error('Latest game not found')
            }

            const turn = await turnRepository.findForGameIdAndTurnCount(
                conn,
                gameRecord.id,
                turnCount
            )

            return new findLatestGameTurnByTurnCountOutput(
                turnCount,
                turn.board.discs,
                turn.nextDisc,
                // TODO 決着がついている場合、game_resultsテーブルから取得する
                undefined
            )
        } finally {
            await conn.end()
        }
    }

    async registerTurn(
        turnCount: number, 
        disc: number,
        x: number,
        y: number
    ) {
        const conn = await connectMySQL()
        try {
            // 1つ前のターンを取得する
            const gameRecord = await gameGateway.findLatest(conn)
            if (!gameRecord) {
                throw new Error('Latest game not found')
            }

            const previousTurnCount = turnCount - 1
            const previousTurn = await turnRepository.findForGameIdAndTurnCount(
                conn,
                gameRecord.id,
                previousTurnCount
            )

            // 石を置く
            const newTurn = previousTurn.placeNext(toDisc(disc), new Point(x, y))

            // ターンを保存する
            await turnRepository.save(conn, newTurn)

            await conn.commit()
        } finally {
            await conn.end()
        }
    }
}