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
