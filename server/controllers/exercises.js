import { pool } from "../config/database.js";

const DIFFICULTIES = new Set(["beginner", "intermediate", "expert"]);

function parseId(value) {
  const id = Number.parseInt(value, 10);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function normalizeExercise(body) {
  return {
    exercise_name:
      typeof body.exercise_name === "string"
        ? body.exercise_name.trim()
        : undefined,
    target_muscle:
      typeof body.target_muscle === "string"
        ? body.target_muscle.trim().toLowerCase()
        : undefined,
    equipment_needed:
      typeof body.equipment_needed === "string"
        ? body.equipment_needed.trim().toLowerCase()
        : undefined,
    difficulty:
      typeof body.difficulty === "string"
        ? body.difficulty.trim().toLowerCase()
        : undefined,
    is_active: typeof body.is_active === "boolean" ? body.is_active : undefined,
  };
}

function validateExercise(values, { partial = false } = {}) {
  const errors = {};
  const requiredFields = [
    "exercise_name",
    "target_muscle",
    "equipment_needed",
    "difficulty",
  ];

  for (const field of requiredFields) {
    if (!partial && !values[field]) errors[field] = `${field} is required`;
    if (partial && values[field] === "") {
      errors[field] = `${field} cannot be empty`;
    }
  }

  if (values.exercise_name?.length > 100) {
    errors.exercise_name = "Exercise name must be 100 characters or fewer";
  }
  if (values.target_muscle?.length > 50) {
    errors.target_muscle = "Target muscle must be 50 characters or fewer";
  }
  if (values.equipment_needed?.length > 50) {
    errors.equipment_needed = "Equipment must be 50 characters or fewer";
  }
  if (values.difficulty && !DIFFICULTIES.has(values.difficulty)) {
    errors.difficulty = "Difficulty must be beginner, intermediate, or expert";
  }

  return errors;
}

async function findDuplicate(values, excludedId = null) {
  const result = await pool.query(
    `SELECT exercise_id
       FROM exercises
      WHERE LOWER(exercise_name) = LOWER($1)
        AND target_muscle = $2
        AND equipment_needed = $3
        AND ($4::int IS NULL OR exercise_id <> $4)
      LIMIT 1`,
    [
      values.exercise_name,
      values.target_muscle,
      values.equipment_needed,
      excludedId,
    ],
  );
  return result.rows[0] ?? null;
}

// Public catalog: archived exercises are excluded.
export const getAllExercises = async (req, res) => {
  try {
    const results = await pool.query(
      `SELECT exercise_id, exercise_name, target_muscle,
              equipment_needed, difficulty, is_active,
              image_urls, instructions
         FROM exercises
        WHERE is_active = TRUE
        ORDER BY exercise_name ASC`,
    );
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Admin catalog: optionally includes archived exercises.
export const getAllExercisesAdmin = async (req, res) => {
  const includeInactive = req.query.include_inactive === "true";

  try {
    const results = await pool.query(
      `SELECT exercise_id, exercise_name, target_muscle,
              equipment_needed, difficulty, is_active,
              image_urls, instructions,
              created_at, updated_at
         FROM exercises
        WHERE ($1::boolean = TRUE OR is_active = TRUE)
        ORDER BY exercise_name ASC`,
      [includeInactive],
    );
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getIndividualExercise = async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ message: "A valid exercise ID is required" });
  }

  try {
    const result = await pool.query(
      `SELECT exercise_id, exercise_name, target_muscle,
              equipment_needed, difficulty, is_active,
              image_urls, instructions
         FROM exercises
        WHERE exercise_id = $1 AND is_active = TRUE`,
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Exercise not found" });
    }
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const createExercise = async (req, res) => {
  const values = normalizeExercise(req.body);
  const errors = validateExercise(values);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: "Please correct the exercise fields",
      errors,
    });
  }

  try {
    if (await findDuplicate(values)) {
      return res.status(409).json({ message: "Exercise already exists" });
    }

    const result = await pool.query(
      `INSERT INTO exercises
        (exercise_name, target_muscle, equipment_needed, difficulty)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        values.exercise_name,
        values.target_muscle,
        values.equipment_needed,
        values.difficulty,
      ],
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateExercise = async (req, res) => {
  const id = parseId(req.params.id);
  const values = normalizeExercise(req.body);
  const supplied = Object.fromEntries(
    Object.entries(values).filter(([, value]) => value !== undefined),
  );
  const errors = validateExercise(supplied, { partial: true });

  if (!id) {
    return res.status(400).json({ message: "A valid exercise ID is required" });
  }
  if (Object.keys(supplied).length === 0) {
    return res.status(400).json({ message: "Provide at least one field" });
  }
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: "Please correct the exercise fields",
      errors,
    });
  }

  try {
    const currentResult = await pool.query(
      "SELECT * FROM exercises WHERE exercise_id = $1",
      [id],
    );
    if (currentResult.rows.length === 0) {
      return res.status(404).json({ message: "Exercise not found" });
    }

    const duplicateValues = { ...currentResult.rows[0], ...supplied };
    if (await findDuplicate(duplicateValues, id)) {
      return res.status(409).json({ message: "Exercise already exists" });
    }

    const result = await pool.query(
      `UPDATE exercises
          SET exercise_name = COALESCE($1, exercise_name),
              target_muscle = COALESCE($2, target_muscle),
              equipment_needed = COALESCE($3, equipment_needed),
              difficulty = COALESCE($4, difficulty),
              is_active = COALESCE($5, is_active),
              updated_at = CURRENT_TIMESTAMP
        WHERE exercise_id = $6
        RETURNING *`,
      [
        supplied.exercise_name,
        supplied.target_muscle,
        supplied.equipment_needed,
        supplied.difficulty,
        supplied.is_active,
        id,
      ],
    );
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteExercise = async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ message: "A valid exercise ID is required" });
  }

  try {
    const referenceResult = await pool.query(
      `SELECT COUNT(*)::int AS count
         FROM workouttemplateexercises
        WHERE exercise_id = $1`,
      [id],
    );
    if (referenceResult.rows[0].count > 0) {
      return res.status(409).json({
        message:
          "This exercise is used in workout history. Archive it instead.",
      });
    }

    const result = await pool.query(
      "DELETE FROM exercises WHERE exercise_id = $1 RETURNING *",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Exercise not found" });
    }
    return res.status(200).json({
      message: "Exercise deleted",
      exercise: result.rows[0],
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
