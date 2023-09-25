import mysql from 'mysql2/promise'
import { GameGateway } from '../../../infrastructure/repository/game/gameGateway'
import { Game } from './game'

const gameGateway = new GameGateway()

export interface GameRepository {
    findLatest(conn: mysql.Connection): Promise<Game | undefined>
    save(conn: mysql.Connection, game: Game): Promise<Game>
}