import { pool } from "../config/database.js";

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

  if (!first_name || !last_name) {
    return res
      .status(400)
      .json({ message: "first_name and last_name are required" });
  }

  try {
    const result = await pool.query(
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
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
