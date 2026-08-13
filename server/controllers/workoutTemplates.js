import { pool } from "../config/database.js";

const EXPERIENCE_LEVELS = new Set([
  "beginner",
  "some_experience",
  "intermediate",
  "advanced",
]);
const WORKOUT_SPLITS = new Set(["upper", "lower", "full"]);

function parseId(value) {
  const id = Number.parseInt(value, 10);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function normalizeTemplate(body) {
  return {
    title: typeof body.title === "string" ? body.title.trim() : undefined,
    experience_level:
      typeof body.experience_level === "string"
        ? body.experience_level.trim().toLowerCase()
        : undefined,
    workout_split:
      typeof body.workout_split === "string"
        ? body.workout_split.trim().toLowerCase()
        : undefined,
    is_active:
      typeof body.is_active === "boolean" ? body.is_active : undefined,
  };
}

function validateTemplate(values, { partial = false } = {}) {
  const errors = {};
  for (const field of ["title", "experience_level", "workout_split"]) {
    if (!partial && !values[field]) errors[field] = `${field} is required`;
    if (partial && values[field] === "") {
      errors[field] = `${field} cannot be empty`;
    }
  }

  if (values.title?.length > 100) {
    errors.title = "Title must be 100 characters or fewer";
  }
  if (
    values.experience_level &&
    !EXPERIENCE_LEVELS.has(values.experience_level)
  ) {
    errors.experience_level = "Unsupported experience level";
  }
  if (values.workout_split && !WORKOUT_SPLITS.has(values.workout_split)) {
    errors.workout_split = "Workout split must be upper, lower, or full";
  }
  return errors;
}

export const getAllTemplates = async (req, res) => {
  try {
    const results = await pool.query(
      `SELECT template_id, title, experience_level, workout_split, is_active
         FROM workouttemplates
        WHERE is_active = TRUE
        ORDER BY experience_level, workout_split`,
    );
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllTemplatesAdmin = async (req, res) => {
  const includeInactive = req.query.include_inactive === "true";

  try {
    const result = await pool.query(
      `SELECT wt.*,
              COUNT(ws.session_id)::int AS session_count
         FROM workouttemplates wt
         LEFT JOIN workoutsessions ws ON ws.template_id = wt.template_id
        WHERE ($1::boolean = TRUE OR wt.is_active = TRUE)
        GROUP BY wt.template_id
        ORDER BY wt.experience_level, wt.workout_split`,
      [includeInactive],
    );
    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getIndividualTemplate = async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ message: "A valid template ID is required" });
  }

  try {
    const result = await pool.query(
      `SELECT template_id, title, experience_level, workout_split, is_active
         FROM workouttemplates
        WHERE template_id = $1 AND is_active = TRUE`,
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Template not found" });
    }
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const createWorkoutTemplate = async (req, res) => {
  const values = normalizeTemplate(req.body);
  const errors = validateTemplate(values);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: "Please correct the template fields",
      errors,
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO workouttemplates
        (title, experience_level, workout_split)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [values.title, values.experience_level, values.workout_split],
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "A template already exists for that experience and split",
      });
    }
    return res.status(500).json({ error: error.message });
  }
};

export const updateWorkoutTemplate = async (req, res) => {
  const id = parseId(req.params.id);
  const values = normalizeTemplate(req.body);
  const supplied = Object.fromEntries(
    Object.entries(values).filter(([, value]) => value !== undefined),
  );
  const errors = validateTemplate(supplied, { partial: true });

  if (!id) {
    return res.status(400).json({ message: "A valid template ID is required" });
  }
  if (Object.keys(supplied).length === 0) {
    return res.status(400).json({ message: "Provide at least one field" });
  }
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: "Please correct the template fields",
      errors,
    });
  }

  try {
    const result = await pool.query(
      `UPDATE workouttemplates
          SET title = COALESCE($1, title),
              experience_level = COALESCE($2, experience_level),
              workout_split = COALESCE($3, workout_split),
              is_active = COALESCE($4, is_active),
              updated_at = CURRENT_TIMESTAMP
        WHERE template_id = $5
        RETURNING *`,
      [
        supplied.title,
        supplied.experience_level,
        supplied.workout_split,
        supplied.is_active,
        id,
      ],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Workout template not found" });
    }
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "A template already exists for that experience and split",
      });
    }
    return res.status(500).json({ error: error.message });
  }
};

export const deleteWorkoutTemplate = async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ message: "A valid template ID is required" });
  }

  try {
    const references = await pool.query(
      `SELECT COUNT(*)::int AS count
         FROM workoutsessions
        WHERE template_id = $1`,
      [id],
    );
    if (references.rows[0].count > 0) {
      return res.status(409).json({
        message: "This template has workout history. Archive it instead.",
      });
    }

    const result = await pool.query(
      "DELETE FROM workouttemplates WHERE template_id = $1 RETURNING *",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Workout template not found" });
    }
    return res.status(200).json({
      message: "Workout template deleted",
      workoutTemplate: result.rows[0],
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
