import { apiRequest } from "./apiClient.js";

// Sends administrator credentials to the authentication endpoint.
export function loginAdmin(credentials) {
  return apiRequest("/api/auth/admin/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}
