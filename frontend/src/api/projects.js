import { apiFetch } from "./client";

export function getProjects() {
  return apiFetch("/api/projects");
}

export function getProject(id) {
  return apiFetch(`/api/projects/${id}`);
}

export function getRelatedProjects(id) {
  return apiFetch(`/api/projects/${id}/related`);
}

export function createProject(payload) {
  return apiFetch("/api/projects", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateProject(id, payload) {
  return apiFetch(`/api/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteProject(id) {
  return apiFetch(`/api/projects/${id}`, { method: "DELETE" });
}
