import connection from "../database";

export async function save(playerOneId:number, playerTwoId: number, password: string) {
    
    const result = await connection.query(`
    INSERT INTO match ("password", "playerOneId","playerTwoId")
    VALUES ($1, $2, $3) RETURNING *
    `, [password ,playerOneId, playerTwoId]);

    return result.rows[0];
}

export async function getMatchByPassword(password:string): Promise<{
    id : number,
    playerOneId : number,
    playerTwoId : number,
    playerOneMove : number,
    playerTwoMove : number,
    winner : number
}>{
    
    const result = await connection.query(`
        SELECT * FROM match WHERE password = $1
    `, [password]);

    return result.rows[0]
}

export async function saveMoviment(moveId: number, password: string, playerPosition: number){

    const positions = [null, "playerOneMove", "playerTwoMove"];
    const player = positions[playerPosition];

    const result = await connection.query(`
        UPDATE match
        SET "${player}" = $1
        WHERE password = $2
    `, [moveId, password]);

    return true
}

export async function saveResult(password: string,winner : number){

    const result = await connection.query(`
        UPDATE match
        SET winner = $1
        WHERE password = $2 
        RETURNING *
    `, [winner, password]);

    return result.rows[0]
}