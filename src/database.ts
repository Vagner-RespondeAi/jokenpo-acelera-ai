import { Pool } from "pg";

const connection = new Pool({
    host : "localhost",
    user : "postgres",
    password : "admin",
    port : 5432,
    database : "test"
});

export default connection