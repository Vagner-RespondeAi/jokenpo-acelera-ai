import { savePlayer, getPlayerByName } from "../repository/playerRepository";

export async function generateNewPlayer(name: string){

    const existingPlayer = await getPlayerByName(name);

    if(existingPlayer){
        return false
    }

    const newPlayer = await savePlayer(name)    

    return newPlayer;
}