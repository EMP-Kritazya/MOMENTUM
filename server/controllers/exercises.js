import { pool } from "../config/database.js";

// GET /api/exercises
export const getAllExercises = async (req, res) => {
  try {
    const results = await pool.query(
      `SELECT * FROM exercises ORDER BY exercise_id ASC`,
    );
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/exercises/:id
export const getIndividualExercise = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM exercises WHERE exercise_id = $1",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Exercise not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/exercises
// exercise_name, target_muscle, equipment_needed, difficulty.
export const createExercise = async (req, res) => {
  const { exercise_name, target_muscle, equipment_needed, difficulty } =
    req.body;

  if (!exercise_name) {
    return res.status(400).json({ message: "exercise_name is required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO exercises (exercise_name, target_muscle, equipment_needed, difficulty)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [exercise_name, target_muscle, equipment_needed, difficulty],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PATCH /api/exercises/:id
export const updateExercise = async (req, res) => {
  const { id } = req.params;
  const { exercise_name, target_muscle, equipment_needed, difficulty } =
    req.body;

  try {
    const result = await pool.query(
      `UPDATE exercises
       SET exercise_name   = COALESCE($1, exercise_name),
           target_muscle   = COALESCE($2, target_muscle),
           equipment_needed = COALESCE($3, equipment_needed),
           difficulty      = COALESCE($4, difficulty)
       WHERE exercise_id = $5
       RETURNING *`,
      [exercise_name, target_muscle, equipment_needed, difficulty, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Exercise not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/exercises/:id
export const deleteExercise = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM exercises WHERE exercise_id = $1 RETURNING *",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Exercise not found" });
    }
    res
      .status(200)
      .json({ message: "Exercise deleted", exercise: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
