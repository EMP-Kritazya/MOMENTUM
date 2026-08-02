const API_BASE_URL = "http://localhost:3001/api";

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

  const response = await fetch(
    `${API_BASE_URL}/workoutsessions/user/${userId}/history?${params}`,
    { signal, credentials: "include" },
  );

  return readJson(response);
}

export async function getWorkoutTemplateDetails(templateId, signal) {
  const response = await fetch(
    `${API_BASE_URL}/workouttemplates/${templateId}/exercises`,
    { signal, credentials: "include" },
  );

  return readJson(response);
}