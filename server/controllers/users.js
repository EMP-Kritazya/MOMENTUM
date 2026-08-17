import { pool } from "../config/database.js";
import { createToken, setAuthCookie } from "./authController.js";

// Allowed onboarding values shared with the frontend form.
const FITNESS_GOALS = new Set([
  "build_muscle",
  "lose_weight",
  "improve_endurance",
  "stay_active",
]);

const EXPERIENCE_LEVELS = new Set([
  "beginner",
  "some_experience",
  "intermediate",
  "advanced",
]);

const PREFERRED_LOCATIONS = new Set(["home", "gym", "outdoors", "mixed"]);

const EQUIPMENT_OPTIONS = new Set([
  "none",
  "dumbbells",
  "resistance_bands",
  "full_gym",
]);

const WEEKLY_COMMITMENTS = new Set([2, 3, 4, 5]);

// Validates untrusted onboarding data before it reaches PostgreSQL.
function validateOnboarding(body) {
  const errors = {};

  const equipment = body.equipment_available;

  if (!FITNESS_GOALS.has(body.fitness_goal)) {
    errors.fitness_goal = "Select a supported fitness goal.";
  }

  if (!EXPERIENCE_LEVELS.has(body.experience_level)) {
    errors.experience_level = "Select a supported experience level.";
  }

  if (!PREFERRED_LOCATIONS.has(body.preferred_location)) {
    errors.preferred_location = "Select a supported workout location.";
  }

  if (
    // Equipment is a multi-select field, so it must be a valid array.
    !Array.isArray(equipment) ||
    equipment.length === 0 ||
    equipment.some((item) => !EQUIPMENT_OPTIONS.has(item))
  ) {
    errors.equipment_available = "Select at least one equipment option.";
  }

  if (!WEEKLY_COMMITMENTS.has(body.weekly_commitment)) {
    errors.weekly_commitment = "Select a supported weekly commitment.";
  }

  return errors;
}

// POST /api/users
export const createUser = async (req, res) => {
  const errors = validateOnboarding(req.body);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: "Please correct onboarding fields",
      errors,
    });
  }
  const {
    fitness_goal,
    experience_level,
    equipment_available,
    weekly_commitment,
    onboarded,
  } = req.body;

  const user_id = req.auth?.userId;

  try {
    const user = await pool.query(
      `SELECT user_id FROM users WHERE user_id = $1`,
      [user_id],
    );
    console.log(user.rows[0]);
    if (user.rows.length === 0) {
      return res.status(400).json({
        error: "Cannot find the user",
      });
    }

    let result;
    if (user.rows.length != 0) {
      result = await pool.query(
        `UPDATE users
        SET fitness_goal = $1,
            experience_level= $2,
            equipment_available= $3,
            weekly_commitment= $4,
            current_streak= $5,
            onboarded = $6
       WHERE user_id = $7
       RETURNING *`,
        [
          fitness_goal,
          experience_level,
          equipment_available,
          weekly_commitment,
          0,
          onboarded,
          user_id,
        ],
      );
    } else {
      result = await pool.query(
        `UPDATE users SET
         fitness_goal = $1,
         experience_level = $2,
         equipment_available = $3,
         weekly_commitment = $4,
         onboarded = $5,
         WHERE user_id = $6
         RETURNING *
        `,
        [
          fitness_goal,
          experience_level,
          equipment_available,
          weekly_commitment,
          onboarded,
          user_id,
        ],
      );
    }

    // matching the pattern used everywhere else in authController.js.
    const token = createToken(result.rows[0].user_id, result.rows[0].role);
    setAuthCookie(res, token);

    const isNewUser = user.rows.length === 0;

    return res.status(isNewUser ? 201 : 200).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      if (error.constraint?.includes("username")) {
        return res.status(400).json({
          message: "Please correct onboarding fields",
          errors: { username: "That username is already taken." },
        });
      }
      if (error.constraint?.includes("email")) {
        return res.status(400).json({
          message: "Please correct onboarding fields",
          errors: { email: "That email is already registered." },
        });
      }
    }
    return res.status(500).json({ error: error.message });
  }
};

// PATCH /api/users/:id
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    username,
    firstname,
    lastname,
    email,
    fitness_goal,
    experience_level,
    equipment_available,
    weekly_commitment,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users
       SET username            = COALESCE($1, username),
           firstname          = COALESCE($2, firstname),
           lastname           = COALESCE($3, lastname),
           email               = COALESCE($4, email),
           fitness_goal        = COALESCE($5, fitness_goal),
           experience_level    = COALESCE($6, experience_level),
           equipment_available = COALESCE($7, equipment_available),
           weekly_commitment   = COALESCE($8, weekly_commitment)
       WHERE user_id = $9
       RETURNING *`,
      [
        username,
        firstname,
        lastname,
        email,
        fitness_goal,
        experience_level,
        equipment_available,
        weekly_commitment,
        id,
      ],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/users/:id
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM users WHERE user_id = $1 RETURNING *",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted", user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
