import { apiRequest } from "./apiClient.js";

// Creates a user from the completed onboarding form.
export function createOnboardingUser(payload) {
  return apiRequest("/api/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Gets the authenticated user's profile.
export function getUserProfile(token) {
  return apiRequest("/api/users/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
