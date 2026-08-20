import "./dotenv.js";

export const isProduction =
  process.env.NODE_ENV?.trim() === "production" ||
  process.env.RENDER === "true";

const LOCAL_CLIENT_URL = "http://localhost:5174";
const LOCAL_SERVER_URL = `http://localhost:${process.env.PORT || 3001}`;

export const CLIENT_URL = isProduction
  ? process.env.CLIENT_URL
  : LOCAL_CLIENT_URL;
export const GITHUB_CALLBACK_URL = isProduction
  ? process.env.GITHUB_CALLBACK_URL
  : `${LOCAL_SERVER_URL}/auth/github/callback`;

if (isProduction && !process.env.CLIENT_URL) {
  throw new Error(
    "CLIENT_URL must be set in production (check Render's environment settings) — refusing to fall back to a localhost URL.",
  );
}
