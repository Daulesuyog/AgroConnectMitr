// import pg from "pg";

// const db = new pg.Client ({
//     user: "postgres",
//     host: "localhost",
//     database: "AgroConnectMitr",
//     password: "12345678",
//     port: "5432"
// })

// export default db;

// import pg from "pg";

// const db = process.env.DATABASE_URL
//   ? new pg.Client({
//       connectionString: process.env.DATABASE_URL,
//       ssl: {
//         rejectUnauthorized: false,
//       },
//     })
//   : new pg.Client({
//       user: "postgres",
//       host: "localhost",
//       database: "AgroConnectMitr",
//       password: "12345678",
//       port: 5432,
//     });

// export default db;

import pg from "pg";
import dotenv from "dotenv";
dotenv.config();
const { Client } = pg;

const db = process.env.DATABASE_URL
  ? new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes('localhost')
        ? false
        : { rejectUnauthorized: false },
    })
  : new Client({
      host: process.env.PGHOST || 'localhost',
      port: process.env.PGPORT || 5432,
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || '12345678',
      database: process.env.PGDATABASE || 'Ganpatibappa"',
    });

    export default db;