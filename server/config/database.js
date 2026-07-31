import pg from "pg";
import "./dotenv.js";

const config = {
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  ssl: {
    rejectUnauthorized: false,
  },
};

export const pool = new pg.Pool(config);

export const connectDB = async () => {
  // Try verifying connection
  const client = await pool.connect();
  //release once verified
  client.release();
};
