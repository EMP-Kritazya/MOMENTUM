import { apiRequest } from "./apiClient.js";

// Creates a user from the completed onboarding form.
export function createOnboardingUser(payload) {
  return apiRequest("/api/users/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Gets the authenticated user's profile.
export function getUserProfile() {
  return apiRequest("/api/users/profile");
}

// Get user current workout Session
export function getUserWorkout() {
  return apiRequest("/api/workoutsessions/todayssession");
}

// Get user current workout Session
export function getProgressInsight() {
  return apiRequest("/api/progressInsight");
}

// Get the signed-in user's monthly activity grid + weekly progress bars
export function getActivitySummary() {
  return apiRequest("/api/workoutsessions/activity-summary");
}

export function updateSession(payload) {
  return apiRequest("/api/workoutsessions/updatesession", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function updateExerciseCompletion(templateExerciseId, payload) {
  return apiRequest(`/api/workoutsessions/exercise/${templateExerciseId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
