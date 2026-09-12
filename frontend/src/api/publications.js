import { apiFetch } from "./client";

export function getPublications() {
  return apiFetch("/api/publications");
}

export function getPublication(id) {
  return apiFetch(`/api/publications/${id}`);
}

export function createPublication(payload) {
  return apiFetch("/api/publications", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updatePublication(id, payload) {
  return apiFetch(`/api/publications/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deletePublication(id) {
  return apiFetch(`/api/publications/${id}`, { method: "DELETE" });
}
