import { Request, Response } from "express";
import { startMatch , makeMoviment, calculateMatchResult} from "../service/matchService";

export async function createNewMatch(req:Request, res: Response) {
    
    try{
        const {playerOne, playerTwo} = req.body;
        if(!playerOne || !playerTwo) {
            return res.sendStatus(422)
        }
    
        //iniciar partida
        const newMatchPassword = await startMatch(playerOne, playerTwo)
    
        return res.send({password: newMatchPassword})
    
    }catch(err){
        console.log(err)
        return res.sendStatus(500)
    }
}

export async function submitPlayerMoviment(req:Request, res: Response) {
    try{
        const { matchPassword } = req.params;
        const playerId :number= Number(req.params.playerId);
        const {move} = req.body

        if(!move){
            return res.sendStatus(422)
        }

        const result = await makeMoviment(playerId, matchPassword, move);
        if(result){
            res.sendStatus(200)
        }
        
    }
    catch(err){
        res.sendStatus(500)
    }
}

export async function getMatchResult(req: Request, res: Response) {
    // /match/:matchPassword/result
    try {
        const { matchPassword } = req.params;

        const match = await calculateMatchResult(matchPassword);

        if (!match) {
            return res.sendStatus(403)
        }
        return res.send(match)
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }

}