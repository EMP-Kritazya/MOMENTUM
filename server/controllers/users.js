import { pool } from "../config/database.js";
import { createToken } from "./authController.js";

const addCookie = (res, userId, role) => {
  const token = createToken(userId, role);
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("authToken", token, {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    maxAge: 15 * 60 * 1000,
  });
};

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

  const username = body.username?.trim();
  const first_name = body.first_name?.trim();
  const last_name = body.last_name?.trim();
  const email = body.email?.trim();
  const equipment = body.equipment_available;

  if (!username) {
    errors.username = "Username is required";
  }
  if (!first_name) {
    errors.first_name = "First name is required";
  }
  if (!last_name) {
    errors.last_name = "Last name is required";
  }
  if (!email) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }
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

// GET /api/users
export const getAllUsers = async (req, res) => {
  try {
    const results = await pool.query(
      `SELECT * FROM users ORDER BY user_id ASC`,
    );
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/users/
export const getIndividualUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/users
export const createUser = async (req, res) => {
  // Returns all validation problems in one response.
  const errors = validateOnboarding(req.body);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: "Please correct onboarding fields",
      errors,
    });
  }
  const {
    username,
    first_name,
    last_name,
    email,
    fitness_goal,
    experience_level,
    equipment_available,
    weekly_commitment,
  } = req.body;

  try {
    const user = await pool.query(
      `SELECT user_id FROM users WHERE email = $1`,
      [email],
    );
    let result;
    // If user doesn;t exist; Create one
    if (user.rows.length === 0) {
      result = await pool.query(
        `INSERT INTO users
        (username, first_name, last_name, email, fitness_goal,
         experience_level, equipment_available, weekly_commitment)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
        [
          username,
          first_name,
          last_name,
          email,
          fitness_goal,
          experience_level,
          equipment_available,
          weekly_commitment,
        ],
      );
    } else {
      result = await pool.query(
        `UPDATE users SET
         fitness_goal = $1,
         experience_level = $2,
         equipment_available = $3,
         weekly_commitment = $4,
         WHERE email = $5
         RETURNING *
        `,
        [
          fitness_goal,
          experience_level,
          equipment_available,
          weekly_commitment,
          email,
        ],
      );
    }

    addCookie(res, result.rows[0].user_id, result.rows[0].role);

    const isNewUser = user.rows.length === 0;

    return res.status(isNewUser ? 201 : 200).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// PATCH /api/users/:id
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    username,
    first_name,
    last_name,
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
           first_name          = COALESCE($2, first_name),
           last_name           = COALESCE($3, last_name),
           email               = COALESCE($4, email),
           fitness_goal        = COALESCE($5, fitness_goal),
           experience_level    = COALESCE($6, experience_level),
           equipment_available = COALESCE($7, equipment_available),
           weekly_commitment   = COALESCE($8, weekly_commitment)
       WHERE user_id = $9
       RETURNING *`,
      [
        username,
        first_name,
        last_name,
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
