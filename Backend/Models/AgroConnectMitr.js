// import pg from "pg";

// const db = new pg.Client ({
//     user: "postgres",
//     host: "localhost",
//     database: "AgroConnectMitr",
//     password: "12345678",
//     port: "5432"
// })

// export default db;

import pg from "pg";

const db = process.env.DATABASE_URL
  ? new pg.Client({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    })
  : new pg.Client({
      user: "postgres",
      host: "localhost",
      database: "AgroConnectMitr",
      password: "12345678",
      port: 5432,
    });

export default db;