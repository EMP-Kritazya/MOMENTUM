import { apiRequest, adminApiRequest } from "./apiClient.js";

// Public request
export function getExercises() {
  return apiRequest("/api/exercises");
}

export function getAdminExercises({ includeInactive = true } = {}) {
  const params = new URLSearchParams({
    include_inactive: String(includeInactive),
  });
  return adminApiRequest(`/api/exercises/admin/all?${params}`);
}

// Admin-only request
export function createExercise(payload) {
  return adminApiRequest("/api/exercises", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Admin-only request
export function updateExercise(id, payload) {
  return adminApiRequest(`/api/exercises/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

// Admin-only request
export function deleteExercise(id) {
  return adminApiRequest(`/api/exercises/${id}`, {
    method: "DELETE",
  });
}
