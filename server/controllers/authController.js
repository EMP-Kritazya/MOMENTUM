import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/database.js";
import { reconcileStreak } from "./workoutSessions.js";
import { isProduction } from "../config/urls.js";

const SESSION_DURATION_MS = 60 * 60 * 1000; // 60 minutes

export const createToken = (userId, role = "member") => {
  return jwt.sign({ userId, role }, `${process.env.JWT_SECRET}`, {
    expiresIn: SESSION_DURATION_MS / 1000, // jsonwebtoken accepts seconds
  });
};

export const setAuthCookie = (res, token) => {
  res.cookie("authToken", token, {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    maxAge: SESSION_DURATION_MS,
  });
};

// Authenticates an administrator and returns a short-lived JWT.
export async function loginAdmin(req, res) {
  // Normalizes credentials received from the login form.
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password?.trim();

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  try {
    // Retrieves the account and password hash by unique email.
    const result = await pool.query(
      `
            SELECT
                user_id,
                username,
                firstname,
                lastname,
                email,
                password_hash,
                role
            FROM Users
            WHERE email = $1
            LIMIT 1;
        `,
      [email],
    );

    const user = result.rows[0];
    // Safely compares the submitted password with the stored hash.
    const passwordMatch =
      user?.password_hash &&
      (await bcrypt.compare(password, user.password_hash));
    if (!user || !passwordMatch || user.role !== "admin") {
      return res.status(401).json({ message: "Invalid admincredentials" });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured.");
    }

    const token = createToken(user.user_id, user.role);

    setAuthCookie(res, token);
    return res.status(200).json({
      user: {
        user_id: user.user_id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Unable to authenticate admin:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getMe(req, res) {
  const userId = req.auth.userId ?? req.auth.id;

  try {
    await reconcileStreak(userId, req.timeZone);

    const result = await pool.query(
      `SELECT user_id, username, firstname, lastname, email, password_hash, role, current_streak, weekly_commitment, onboarded
       FROM users
       WHERE user_id = $1
       LIMIT 1`,
      [userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user: result.rows[0] });
  } catch (error) {
    console.error("Unable to load current user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export function logout(req, res) {
  res.clearCookie("authToken", {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
  });
  return res.status(200).json({ message: "Logged out" });
}

export function sessionFromToken(req, res) {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ message: "token is required" });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  setAuthCookie(res, token);
  return res.status(200).json({ message: "Session established" });
}

// Authenticates a regular user via username + email
export async function loginUser(req, res) {
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password?.trim();

  if (!password || !email) {
    return res.status(400).json({ message: "Password and email are required" });
  }

  try {
    const result = await pool.query(
      `SELECT user_id, username, firstname, lastname, email, password_hash, role, current_streak
       FROM users
       WHERE email = $1
       LIMIT 1`,
      [email],
    );

    const user = result.rows[0];

    const passwordMatch =
      user?.password_hash &&
      (await bcrypt.compare(password, user.password_hash));

    if (!user || !passwordMatch) {
      return res.status(404).json({
        message:
          "Please enter valid credentials. Sign Up if you don't have an account",
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured.");
    }

    const token = createToken(user.user_id, user.role);
    setAuthCookie(res, token);

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Unable to authenticate user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function signUpUser(req, res) {
  const firstname = req.body.firstname?.trim();
  const lastname = req.body.lastname?.trim();
  const username = req.body.username?.trim();
  const email = req.body.email?.trim();
  const password = req.body.password;
  const onboarded = false;

  if (!username || !email || !username || !email || !password) {
    return res.status(400).json({ message: "ALl fields are required" });
  }

  try {
    // fist see if the email is already registered
    const isUser = await pool.query(`SELECT * FROM users where email = $1`, [
      email,
    ]);

    if (isUser.rows.length > 0) {
      return res
        .status(409)
        .json({ message: "Email is already registered. Try loggin in" });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `
      INSERT INTO users (firstname, lastname, username, email, password_hash, onboarded) VALUES($1, $2, $3, $4, $5, $6) RETURNING *
      `,
      [firstname, lastname, username, email, passwordHash, onboarded],
    );

    const user = result.rows[0];

    if (!user) {
      return res
        .status(404)
        .json({ message: "Failed to register. Please try again" });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured.");
    }

    const token = createToken(user.user_id, user.role);
    setAuthCookie(res, token);

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Unable to authenticate user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
