import { apiRequest } from "./apiClient.js";

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

  return apiRequest(`/api/workoutsessions/user/${userId}/history?${params}`, {
    signal,
  });
}

export async function getWorkoutSessionDetails(sessionId, signal) {
  return apiRequest(`/api/workoutsessions/${sessionId}/exercises`, {
    signal,
  });
}
