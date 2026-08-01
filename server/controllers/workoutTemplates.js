import { pool } from "../config/database.js";

// GET /api/workouttemplates
export const getAllTemplates = async (req, res) => {
  try {
    const results = await pool.query(
      `SELECT * FROM workouttemplates ORDER BY template_id`,
    );
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/workouttemplates/:id
export const getIndividualTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const results = await pool.query(
      "SELECT * FROM workouttemplates WHERE template_id = $1",
      [id],
    );

    if (results.rows.length === 0) {
      return res.status(404).json({ message: "Template not found" });
    }
    res.status(200).json(results.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/workouttemplates/:id/exercises
export const getTemplateExercises = async (req, res) => {
  try {
    const { id } = req.params;

    const templateResult = await pool.query(
      "SELECT * FROM workouttemplates WHERE template_id = $1",
      [id],
    );
    if (templateResult.rows.length === 0) {
      return res.status(404).json({ message: "Template not found" });
    }
    const template = templateResult.rows[0];

    // Pulling out the exercises through the join table, in workout order.
    const exercisesResult = await pool.query(
      `SELECT e.exercise_id,
              e.exercise_name,
              e.target_muscle,
              e.equipment_needed,
              wte.sets,
              wte.reps,
              wte.exercise_order
       FROM workouttemplateexercises wte
       JOIN exercises e ON e.exercise_id = wte.exercise_id
       WHERE wte.template_id = $1
       ORDER BY wte.exercise_order ASC`,
      [id],
    );

    res.status(200).json({
      ...template,
      exercises: exercisesResult.rows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/workouttemplates
export const createWorkoutTemplate = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Workout title is required" });
    }

    const results = await pool.query(
      "INSERT INTO workouttemplates (title) VALUES ($1) RETURNING *",
      [title],
    );

    res.status(201).json(results.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PATCH /api/workouttemplates/:id
export const updateWorkoutTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const results = await pool.query(
      `UPDATE workouttemplates
       SET title = COALESCE($1, title)
       WHERE template_id = $2
       RETURNING *`,
      [title, id],
    );

    if (results.rows.length === 0) {
      return res.status(404).json({ message: "Workout template not found" });
    }
    res.status(200).json(results.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/workouttemplates/:id
export const deleteWorkoutTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    const results = await pool.query(
      "DELETE FROM workouttemplates WHERE template_id = $1 RETURNING *",
      [id],
    );
    if (results.rows.length === 0) {
      return res.status(404).json({ message: "Workout template not found" });
    }
    res.status(200).json({
      message: "Workout template deleted",
      workoutTemplate: results.rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
