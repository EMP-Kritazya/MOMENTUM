import { apiRequest } from "./apiClient.js";

async function readJson(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || "Request failed");
  }

  return data;
}

export async function getWorkoutHistory(userId, filters, signal) {
  const params = new URLSearchParams({
    status: filters.status,
    sort: filters.sort,
    page: String(filters.page),
    limit: String(filters.limit),
  });

  if (filters.muscle) {
    params.set("muscle", filters.muscle);
  }

    return apiRequest(
      `/api/workoutsessions/user/${userId}/history?${params}`,
      { signal },
    )
}

export async function getWorkoutTemplateDetails(templateId, signal) {
    return apiRequest(
      `/api/workouttemplates/${templateId}/exercises`,
      { signal },
    );
}