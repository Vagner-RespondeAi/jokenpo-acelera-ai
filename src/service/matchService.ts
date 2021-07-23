import { v4 } from "uuid";
import { save, getMatchByPassword, saveMoviment, saveResult } from "../repository/matchRepository";
import { getMoveById } from "../repository/moveRepository";

export async function startMatch(playerOneId : number, playerTwoId: number){

    //gerar senha
    const password = v4();

    //salvar no banco
    const newMatch = await save(playerOneId, playerTwoId, password);

    return newMatch.password;
}

export async function makeMoviment(playerId: number, matchPassword: string, moveId: number) {
    
    const match = await getMatchByPassword(matchPassword);

    //pegar o movimento e validar (saber se existe)
    const isValid = await validateMove(match, playerId, moveId);

    if(isValid){
        //salvar o movimento na partida.
        const playerPosition = await getPlayerPosition(match, playerId);

        await saveMoviment(moveId, matchPassword, playerPosition);
        return true
    }
    return false
    
}

async function getPlayerPosition(match: any, playerId:number ) {
    if(playerId === match.playerOneId){
        return 1;
    }
    if(playerId === match.playerTwoId){
        return 2;
    }
}

export async function validateMove(match:any, playerId: number,moveId: number): Promise<boolean> {
    const playerMove = await getMoveById(moveId)

    if(!match || !playerMove){
        return false
    }
    //saber se ele ja jogou
    if(playerId === match.playerOneId && match.playerOneMove){
        return false
    }
    if(playerId === match.playerTwoId && match.playerTwoMove){
        return false
    }

    return true;
}

export async function calculateMatchResult(matchPassword: string){

    const match = await getMatchByPassword(matchPassword);

    const playerOneMove = await getMoveById(match.playerOneMove);
    const playerTwoMove = await getMoveById(match.playerTwoMove);

    const p1MoveName:string = playerOneMove.name;
    const p2MoveName:string = playerTwoMove.name;

    if(!p1MoveName || !p2MoveName) return

    const winner = checkWin(p1MoveName, p2MoveName);

    //salvar o resultado da partida. 
    const finishedMatch = await saveResult(matchPassword,winner);

    return finishedMatch;

}

function checkWin(moviment1: string, moviment2:string): number{

    const moves : any= {
        "rock" : "paper",
        "paper" : "scissors",
        "scissors" : "rock"
    }

    if(moviment1 === moviment2) return 0;

    if(moves[moviment1] === moviment2) return 2;

    return 1;
}