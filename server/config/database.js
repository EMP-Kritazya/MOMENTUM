import pg from "pg";
import "./dotenv.js";

const useSSL = process.env.PGSSL === "true";
const ssl = useSSL ? { rejectUnauthorized: false } : false;

// Render supplies one connection string; local development can keep using PG*.
const config = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl,
    }
  : {
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      host: process.env.PGHOST,
      port: process.env.PGPORT,
      database: process.env.PGDATABASE,
      ssl,
    };

export const pool = new pg.Pool(config);

export const connectDB = async () => {
  // Try verifying connection
  const client = await pool.connect();
  //release once verified
  client.release();
};
