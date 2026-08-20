import { Strategy as GitHubStrategy } from "passport-github2";
import { pool } from "./database.js";
import "./dotenv.js";

const options = {
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL:
    process.env.GITHUB_CALLBACK_URL ??
    "http://localhost:3001/auth/github/callback",
};

const verify = async (accessToken, refreshToken, profile, callback) => {
  const providerUserId = String(profile.id);
  const username = profile.username;
  const email = profile.emails?.[0]?.value;

  const fullName = profile.displayName || "";
  const nameParts = fullName.split(" ");

  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  try {
    const linked = await pool.query(
      `SELECT u.* FROM user_oauth_accounts uoa
         JOIN users u ON u.user_id = uoa.user_id
        WHERE uoa.provider = 'github' AND uoa.provider_user_id = $1`,
      [providerUserId],
    );
    if (linked.rows.length > 0) {
      return callback(null, linked.rows[0]);
    }

    const existingUser = await pool.query(
      `
      SELECT * FROM users WHERE email = $1
      `,
      [email],
    );

    if (existingUser.rows.length > 0) {
      return callback(null, false, {
        message:
          "An account with this email already exists. Log in with your existing account and link GitHub from your profile.",
      });
    }

    // First time user?
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const created = await client.query(
        `INSERT INTO users (firstname, lastname, username, email) VALUES ($1, $2, $3, $4) RETURNING *`,
        [firstName, lastName, username, email],
      );
      const user = created.rows[0];

      await client.query(
        `INSERT INTO user_oauth_accounts (user_id, provider, provider_user_id)
         VALUES ($1, 'github', $2)`,
        [user.user_id, providerUserId],
      );

      await client.query("COMMIT");
      return callback(null, user);
    } catch (error) {
      await client.query("ROLLBACK");
      if (error.code === "23505") {
        return callback(null, false, {
          message:
            "A Momentum account already uses this GitHub username. Please sign up with a different username first, then link GitHub from your profile.",
        });
      }
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    return callback(error);
  }
};

export const GitHub = new GitHubStrategy(options, verify);
