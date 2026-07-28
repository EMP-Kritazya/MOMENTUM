import { pool } from "../config/database.js";

export const getAllTemplates = async (req, res) => {
  try {
    const results = await pool.query(
      `SELECT * FROM workouttemplates ORDER BY template_id`,
    );
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const getIndividualTemplate = async (req, res) => {
  try {
    const id = req.params;
    const results = await pool.query(
      "SELECT * FROM workouttemplates WHERE template_id = $1",
      [id],
    );

    if (results.rows.length === 0) {
      res.status(404).json({ error: "Template not Found" });
    }
    res.staus(200).json(results.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createWorkoutTemplate = async (req, res) => {
  try {
    const title = req.body;

    if (!title) {
      return res.status(400).json({ message: "Workout Title is Required" });
    }

    const results = await pool.query(
      "INSERT INTO workouttemplates (title) VALUES ($1) RETURNING *",
      [title],
    );

    if (results.rows.length === 0) {
      res.status(500).json({ message: "Error when creating the template" });
    }
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteWorkoutTemplate = async (req, res) => {
  try {
    const id = req.params;

    const results = await pool.query(
      "DELETE from workouttemplates WHERE template_id = $1 RETURNING *",
      [id],
    );
    if (results.rows.length === 0) {
      return res.status(404).json({ message: "Workout Template not found" });
    }
    return res.status(200).json({
      message: "Workout Template deleted",
      workoutTemplate: results.rows[0],
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
