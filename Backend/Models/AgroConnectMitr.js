import pg from "pg";

const db = new pg.Client ({
    user: "postgres",
    host: "localhost",
    database: "AgroConnectMitr",
    password: "12345678",
    port: "5432"
})

export default db;