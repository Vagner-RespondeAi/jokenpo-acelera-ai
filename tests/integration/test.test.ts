import supertest from "supertest";
import app from "../../src/app";
import connection from "../../src/database";
import clearDatabase from "../utils/clearDatabase";
import { createPlayer } from "../utils/playerFactory";

beforeEach(async ()=>{
  await clearDatabase(connection);
})
afterAll(async ()=>{
  await clearDatabase(connection);
  await connection.end();
});

describe("POST /player", () => {

  it("should answer with a new player and status 200", async () => {
    const body = {
      name : "Joaozinho"
    }
    
    const response = await supertest(app).post("/player").send(body);

    expect(response.status).toBe(200)
    expect(response.body).toEqual(expect.objectContaining({
      id : expect.any(Number),
      name : expect.any(String)
    }));
  });

  it("should answer with 422 for invalid body", async () => {
    const body = {}
    
    const response = await supertest(app).post("/player").send(body);

    expect(response.status).toBe(422)
  });
});

describe("POST /match", () => {
  it("should answer with a new match and status 200", async () => {

    const p1 = await connection.query(`INSERT INTO player (name) VALUES ($1) RETURNING *`,["Joao"]);
    const p2 = await connection.query(`INSERT INTO player (name) VALUES ($1) RETURNING *`,["Maria"]);

    const body = {
      playerOne : p1.rows[0].id,
      playerTwo : p2.rows[0].id
    }
    
    const response = await supertest(app).post("/match").send(body);

    expect(response.status).toBe(200)
    expect(response.body).toEqual(expect.objectContaining({
      password : expect.any(String),
    }));
  });

  it("should answer with 422 for invalid body", async () => {
    const body = {}
    
    const response = await supertest(app).post("/match").send(body);

    expect(response.status).toBe(422)
  });
});

describe("POST /match/:matchPassword/:playerId", () => {
  it("should answer with status 200", async () => {

    const rock = await connection.query(`INSERT INTO move (name) VALUES ('rock') RETURNING *`);
    const paper = await connection.query(`INSERT INTO move (name) VALUES ('paper') RETURNING * `);
    const scissor = await connection.query(`INSERT INTO move (name) VALUES ('scissor') RETURNING *`);

    const p1 = await connection.query(`INSERT INTO player (name) VALUES ($1) RETURNING *`,["Joao"]);
    const p2 = await connection.query(`INSERT INTO player (name) VALUES ($1) RETURNING *`,["Maria"]);

    const password = "senhamockada"

    const match = await connection.query(`
    INSERT INTO match ("password", "playerOneId","playerTwoId")
    VALUES ($1, $2, $3) RETURNING *
  `, [password ,p1.rows[0].id, p2.rows[0].id]);

    const body = {
      move : rock.rows[0].id
    }
    
    const response = await supertest(app).post(`/match/${password}/${p1.rows[0].id}`).send(body);

    expect(response.status).toBe(200)
  });

  it("should answer with 422 for invalid body", async () => {
    const rock = await connection.query(`INSERT INTO move (name) VALUES ('rock')`);
    const paper = await connection.query(`INSERT INTO move (name) VALUES ('paper')`);
    const scissor = await connection.query(`INSERT INTO move (name) VALUES ('scissor')`);

    const p1 = await createPlayer()
    const p2 = await createPlayer()

    const password = "senhamockada"

    const match = await connection.query(`
    INSERT INTO match ("password", "playerOneId","playerTwoId")
    VALUES ($1, $2, $3) RETURNING *
    `, [password ,p1.rows[0].id, p2.rows[0].id]);

    const body = {
    }
    
    const response = await supertest(app).post(`/match/${password}/${p1.rows[0].id}`).send(body);
    expect(response.status).toBe(422)
  });
});

describe("GET /match/:matchPassword/result", () => {
  it("should answer with status 200", async () => {

    const rock = await connection.query(`INSERT INTO move (name) VALUES ('rock') RETURNING *`);
    const paper = await connection.query(`INSERT INTO move (name) VALUES ('paper') RETURNING * `);
    const scissor = await connection.query(`INSERT INTO move (name) VALUES ('scissors') RETURNING *`);

    const p1 = await connection.query(`INSERT INTO player (name) VALUES ($1) RETURNING *`,["Joao"]);
    const p2 = await connection.query(`INSERT INTO player (name) VALUES ($1) RETURNING *`,["Maria"]);

    const password = "senhamockada"

    const match = await connection.query(`
    INSERT INTO match ("password", "playerOneId","playerTwoId", "playerOneMove", "playerTwoMove")
    VALUES ($1, $2, $3, $4,$5) RETURNING *
  `, [password ,p1.rows[0].id, p2.rows[0].id, rock.rows[0].id, scissor.rows[0].id])

    console.log(match.rows[0])
    
    const response = await supertest(app).get(`/match/${password}/result`)

    expect(response.status).toBe(200)
    expect(response.body)    

    .toEqual(expect.objectContaining({
      id : expect.any(Number),
      password : expect.any(String),
      playerOneId : expect.any(Number),
      playerTwoId : expect.any(Number),
      playerOneMove : expect.any(Number),
      playerTwoMove : expect.any(Number),
      winner : 1
    }))
  });
});


