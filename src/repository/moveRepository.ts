import connection from "../database";

export async function getMoveById(moveId: number){

    const result = await connection.query(`
        SELECT * FROM move WHERE id = $1
    `, [moveId])

    return result.rows[0];
}