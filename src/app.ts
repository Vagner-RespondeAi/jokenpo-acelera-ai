import express from "express";
import cors from "cors";
import {createNewPlayer} from "./controller/playerController"
import { createNewMatch, submitPlayerMoviment, getMatchResult } from "./controller/matchController";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/player", createNewPlayer);
app.post("/match", createNewMatch);
app.post("/match/:matchPassword/:playerId", submitPlayerMoviment);
app.get("/match/:matchPassword/result", getMatchResult);

export default app;
