import { Router } from "express";
import { pool } from "../config/database.js";

const router = Router();

// Get all exercises
router.get("/", async (req, res) => {
  try {
    const results = await pool.query(
      `SELECT * FROM exercises ORDER BY exercise_id ASC`,
    );
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// Individual Exercise
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM exercises WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Exercise not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
