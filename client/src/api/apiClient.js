// Uses the deployed API URL when configured, otherwise the local server.
const API_URL = import.meta.env.PROD
  ? "https://momentum-bxgh.onrender.com"
  : "http://localhost:3001";
// const API_URL =
//   import.meta.env.VITE_API_URL ?? "http://localhost:3001";

// Sends a request and provides consistent JSON and error handling.
export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    // Sends the httpOnly authToken cookie so protected routes stay authenticated.
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  // Prevents invalid or empty JSON responses from crashing the client.
  const data = await response.json().catch(() => ({
    message: "The server returned an invalid response.",
  }));

  if (!response.ok) {
    const error = new Error(data.message ?? data.error ?? "Request failed.");
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}
// Admin authentication now rides on the httpOnly authToken cookie set at login,
// which the browser attaches automatically via credentials: "include" in apiRequest.
// No token is read from JS; the server authorizes admin routes from the cookie.
export function adminApiRequest(path, options = {}) {
  return apiRequest(path, options);
}
