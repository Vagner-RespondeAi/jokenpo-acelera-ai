import { Request, Response } from "express";
import { generateNewPlayer } from "../service/playerService";

export async function createNewPlayer(req: Request, res: Response) {
    try {
        //req ta certo
        const { name } = req.body;
        if (!name) {
            return res.sendStatus(422);
        }

        //criar um player
        const newPlayer = await generateNewPlayer(name)

        if(!newPlayer){
            return res.sendStatus(409);
        }

        //mandar o player
        return res.send(newPlayer);
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
}
