import "./dotenv.js";
import { pool } from "./database.js";
import { seedDemoData } from "./demoSeeder.js";

seedDemoData()
  .catch((error) => {
    console.error("Unable to seed demo data:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
