import { apiRequest, adminApiRequest } from "./apiClient.js";

export function getWorkoutTemplates() {
  return apiRequest("/api/workouttemplates");
}

export function getAdminWorkoutTemplates({ includeInactive = true } = {}) {
  const params = new URLSearchParams({
    include_inactive: String(includeInactive),
  });
  return adminApiRequest(`/api/workouttemplates/admin/all?${params}`);
}

export function createWorkoutTemplate(payload) {
  return adminApiRequest("/api/workouttemplates", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateWorkoutTemplate(id, payload) {
  return adminApiRequest(`/api/workouttemplates/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteWorkoutTemplate(id) {
  return adminApiRequest(`/api/workouttemplates/${id}`, {
    method: "DELETE",
  });
}
