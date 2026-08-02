import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/database.js";
import "../config/dotenv.js";

// Signs a token with a consistent { userId, role } payload so every consumer
// (getMe, requireAdmin, ownership checks) can rely on the same shape.
export const createToken = (userId, role = "member") => {
  return jwt.sign({ userId, role }, `${process.env.JWT_SECRET}`, {
    expiresIn: "15m",
  });
};

// Sets the auth token as an httpOnly cookie so it is never exposed to client JS.
const setAuthCookie = (res, token) => {
  res.cookie("authToken", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 1000, // 1 hour, matching the token expiry
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
                first_name,
                last_name,
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

    // Signs the user's ID and role for protected admin routes.
    const token = jwt.sign(
      {
        userId: user.user_id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    // Deliver the token as an httpOnly cookie instead of the response body,
    // so it is sent automatically and never readable by client-side JS.
    setAuthCookie(res, token);
    return res.status(200).json({
      user: {
        user_id: user.user_id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Unable to authenticate admin:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Returns the currently authenticated user, identified from the verified cookie.
// Runs behind authenticateToken, which populates req.auth from the JWT.
export async function getMe(req, res) {
  const userId = req.auth.userId ?? req.auth.id;

  try {
    const result = await pool.query(
      `SELECT user_id, username, first_name, last_name, email, role
       FROM Users
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

// Clears the auth cookie. Options must match those used when the cookie was set.
export function logout(req, res) {
  res.clearCookie("authToken", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return res.status(200).json({ message: "Logged out" });
}
