import connection from "../database";

export async function savePlayer(name:string) {
    
    const result = await connection.query(`
        INSERT INTO player (name) VALUES ($1) RETURNING *
    `, [name]);

    return result.rows[0];
}

export async function getPlayerByName(name:string) {
    
    const result = await connection.query(`
        SELECT * FROM player WHERE name = $1
    `, [name])

    return result.rows[0]
}