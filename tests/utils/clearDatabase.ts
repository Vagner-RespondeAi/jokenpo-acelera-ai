import { Pool } from "pg";

export default async function clearDatabase(connection: Pool){

    await connection.query(`
        DELETE from match; DELETE from player; DELETE from move
    `)
}