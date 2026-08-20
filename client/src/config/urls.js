export const API_URL = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL
  : "http://localhost:3001";

if (import.meta.env.PROD && !API_URL) {
  throw new Error(
    "VITE_API_URL is not set for this production build — set it in the deploy platform's environment variables.",
  );
}
