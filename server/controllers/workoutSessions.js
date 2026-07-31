import { pool } from "../config/database.js";

// GET /api/workoutsessions
export const getAllSessions = async (req, res) => {
  try {
    const results = await pool.query(
      `SELECT * FROM workoutsessions ORDER BY date DESC`,
    );
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/workoutsessions/:id
export const getIndividualSession = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM workoutsessions WHERE session_id = $1",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Session not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/workoutsessions
export const createSession = async (req, res) => {
  const { user_id, template_id, date, duration_minutes, completed } = req.body;

  if (!user_id || !template_id || !date || !duration_minutes) {
    return res.status(400).json({
      message: "user_id, template_id, date, and duration_minutes are required",
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO workoutsessions
        (user_id, template_id, date, duration_minutes, completed)
       VALUES ($1, $2, $3, $4, COALESCE($5, FALSE))
       RETURNING *`,
      [user_id, template_id, date, duration_minutes, completed],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    //  If either parent (user or template) doesn't exist,
    if (error.code === "23503") {
      return res
        .status(400)
        .json({ message: "user_id or template_id does not exist" });
    }
    // Uniqueness
    if (error.code === "23505") {
      return res.status(409).json({
        message: "This user already has a session for this template",
      });
    }
    res.status(500).json({ error: error.message });
  }
};

// PATCH /api/workoutsessions/:id
export const updateSession = async (req, res) => {
  const { id } = req.params;
  const { user_id, template_id, date, duration_minutes, completed } = req.body;

  try {
    const result = await pool.query(
      `UPDATE workoutsessions
       SET user_id          = COALESCE($1, user_id),
           template_id      = COALESCE($2, template_id),
           date             = COALESCE($3, date),
           duration_minutes = COALESCE($4, duration_minutes),
           completed        = COALESCE($5, completed)
       WHERE session_id = $6
       RETURNING *`,
      [user_id, template_id, date, duration_minutes, completed, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Session not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23503") {
      return res
        .status(400)
        .json({ message: "user_id or template_id does not exist" });
    }
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/workoutsessions/:id
export const deleteSession = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM workoutsessions WHERE session_id = $1 RETURNING *",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Session not found" });
    }
    res
      .status(200)
      .json({ message: "Session deleted", session: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
