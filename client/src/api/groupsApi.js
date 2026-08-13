import { apiRequest } from "./apiClient.js";

export function getUserGroups(signal) {
  return apiRequest("/api/groups", { signal });
}

export function getGroupMembers(groupId, signal) {
  return apiRequest(`/api/groups/${groupId}/members`, { signal });
}

// Loads the first joined group and its members for the dashboard summary card.
export async function getPrimaryGroupProgress(signal) {
  const groups = await getUserGroups(signal);

  if (groups.length === 0) {
    return null;
  }

  const group = groups[0];
  const members = await getGroupMembers(group.group_id, signal);

  return {
    ...group,
    members,
  };
}

export function createGroup(payload) {
  return apiRequest("/api/groups", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function joinGroup(payload) {
  return apiRequest("/api/groups/join", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateGroup(groupId, payload) {
  return apiRequest(`/api/groups/${groupId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteGroup(groupId) {
  return apiRequest(`/api/groups/${groupId}`, {
    method: "DELETE",
  });
}

export function leaveGroup(groupId) {
  return apiRequest(`/api/groups/${groupId}/members/me`, {
    method: "DELETE",
  });
}
