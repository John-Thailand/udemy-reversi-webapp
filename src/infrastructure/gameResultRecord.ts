export class GameResultRecord {
    constructor(
        private _id: number,
        private _gameId: number,
        private _winnerDIsc: number,
        private _endAt: Date
    ) {}

    get gameId() {
        return this._gameId
    }

    get winnerDisc() {
        return this._winnerDIsc
    }

    get endAt() {
        return this._endAt
    }
}