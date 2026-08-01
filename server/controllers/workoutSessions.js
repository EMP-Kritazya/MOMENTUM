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
      [parseInt(user_id), parseInt(template_id), date, duration_minutes, completed],
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

// GET /api/workoutsessions/user/:userId/history
export const getUserWorkoutHistory = async (req, res) => {
  const userId = Number.parseInt(req.params.user_id, 10);
  const status = String(req.query.status || "all").toLowerCase();
  const muscle = String(req.query.muscle || "").trim();
  const sort = req.query.sort === "asc" ? "ASC" : "DESC";
  const requestedPage = Number.parseInt(req.query.page, 10);
  const requestedLimit = Number.parseInt(req.query.limit, 10);
  const page = Number.isInteger(requestedPage) && requestedPage > 0
    ? requestedPage
    : 1;
  const limit = Number.isInteger(requestedLimit) && requestedLimit > 0
    ? Math.min(requestedLimit, 50)
    : 20;
  const offset = (page - 1) * limit;

  if (!Number.isInteger(userId) || userId < 1) {
    return res.status(400).json({ message: "A valid user ID is required" });
  }

  if (!["all", "completed", "skipped"].includes(status)) {
    return res.status(400).json({
      message: "status must be all, completed, or skipped",
    });
  }

  try {
    const userResult = await pool.query(
      "SELECT user_id FROM users WHERE user_id = $1",
      [userId],
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const values = [userId];
    const conditions = [
      "ws.user_id = $1",
      "(ws.completed = TRUE OR ws.date < CURRENT_DATE)",
    ];

    if (status === "completed") {
      conditions.push("ws.completed = TRUE");
    }

    if (status === "skipped") {
      conditions.push("ws.completed = FALSE");
      conditions.push("ws.date < CURRENT_DATE");
    }

    if (muscle) {
      values.push(muscle);
      conditions.push(`
        EXISTS (
          SELECT 1
          FROM workouttemplateexercises filter_wte
          JOIN exercises filter_e
            ON filter_e.exercise_id = filter_wte.exercise_id
          WHERE filter_wte.template_id = ws.template_id
            AND LOWER(filter_e.target_muscle) = LOWER($${values.length})
        )
      `);
    }

    const whereClause = conditions.join(" AND ");

    const countResult = await pool.query(
      `SELECT COUNT(*) AS total
       FROM workoutsessions ws
       WHERE ${whereClause}`,
      values,
    );

    const pageValues = [...values, limit, offset];
    const limitPosition = pageValues.length - 1;
    const offsetPosition = pageValues.length;

    const historyResult = await pool.query(
      `WITH paged_sessions AS (
         SELECT ws.session_id,
                ws.template_id,
                ws.date,
                ws.duration_minutes,
                ws.completed,
                wt.title
         FROM workoutsessions ws
         JOIN workouttemplates wt
           ON wt.template_id = ws.template_id
         WHERE ${whereClause}
         ORDER BY ws.date ${sort}, ws.session_id ${sort}
         LIMIT $${limitPosition}
         OFFSET $${offsetPosition}
       )
       SELECT ps.session_id,
              ps.template_id,
              ps.title,
              ps.date,
              ps.duration_minutes,
              CASE
                WHEN ps.completed = TRUE THEN 'completed'
                ELSE 'skipped'
              END AS status,
              COALESCE(
                ARRAY_AGG(DISTINCT e.target_muscle)
                  FILTER (WHERE e.target_muscle IS NOT NULL),
                ARRAY[]::VARCHAR[]
              ) AS muscle_groups
       FROM paged_sessions ps
       LEFT JOIN workouttemplateexercises wte
         ON wte.template_id = ps.template_id
       LEFT JOIN exercises e
         ON e.exercise_id = wte.exercise_id
       GROUP BY ps.session_id,
                ps.template_id,
                ps.title,
                ps.date,
                ps.duration_minutes,
                ps.completed
       ORDER BY ps.date ${sort}, ps.session_id ${sort}`,
      pageValues,
    );

    const musclesResult = await pool.query(
      `SELECT DISTINCT e.target_muscle
       FROM workoutsessions ws
       JOIN workouttemplateexercises wte
         ON wte.template_id = ws.template_id
       JOIN exercises e
         ON e.exercise_id = wte.exercise_id
       WHERE ws.user_id = $1
         AND (ws.completed = TRUE OR ws.date < CURRENT_DATE)
         AND e.target_muscle IS NOT NULL
       ORDER BY e.target_muscle ASC`,
      [userId],
    );

    const total = Number.parseInt(countResult.rows[0].total, 10);

    return res.status(200).json({
      workouts: historyResult.rows,
      filters: {
        muscle_groups: musclesResult.rows.map((row) => row.target_muscle),
      },
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};