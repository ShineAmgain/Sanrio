import { apiFetch } from "./client";

export function getResearchGroups() {
  return apiFetch("/api/research-groups");
}

export function getResearchGroup(id) {
  return apiFetch(`/api/research-groups/${id}`);
}

export function createResearchGroup(payload) {
  return apiFetch("/api/research-groups", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateResearchGroup(id, payload) {
  return apiFetch(`/api/research-groups/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteResearchGroup(id) {
  return apiFetch(`/api/research-groups/${id}`, { method: "DELETE" });
}
