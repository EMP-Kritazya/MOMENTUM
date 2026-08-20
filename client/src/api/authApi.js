import { apiRequest } from "./apiClient.js";

// Sends administrator credentials to the authentication endpoint.
export function loginAdmin(credentials) {
  return apiRequest("/api/auth/admin/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function getCurrentUser() {
  return apiRequest("/api/auth/me");
}

export function logoutUser() {
  return apiRequest("/api/auth/logout", { method: "POST" });
}

export function loginUser(payload) {
  return apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function signUpUser(payload) {
  return apiRequest("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Exchanges the token from a GitHub OAuth redirect for the httpOnly auth cookie, set as this fetch's response rather than a redirect.
export function establishGithubSession(token) {
  return apiRequest("/api/auth/session", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}
