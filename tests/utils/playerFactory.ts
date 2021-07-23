import connection from "../../src/database";
import faker from "faker"

export async function createPlayer(){
    const player = {
        name : faker.name.findName()
    }

    const newPlayer = await connection.query(`INSERT INTO player (name) VALUES ($1) RETURNING *`,[player.name]);

    return newPlayer
}