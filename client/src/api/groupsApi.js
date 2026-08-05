import { apiRequest } from "./apiClient.js";

export function getUserGroups(signal) {
  return apiRequest("/api/groups", { signal });
}

export function getGroupMembers(groupId, signal) {
  return apiRequest(`/api/groups/${groupId}/members`, { signal });
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

export function leaveGroup(groupId) {
  return apiRequest(`/api/groups/${groupId}/members/me`, {
    method: "DELETE",
  });
}
