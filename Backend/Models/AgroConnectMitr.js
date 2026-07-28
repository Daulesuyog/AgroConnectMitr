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

const db = process.env.Database_url
  ? new pg.Client({
      connectionString: process.env.Database_url,
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