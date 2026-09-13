import { apiFetch } from "./client";

export function getResources() {
  return apiFetch("/api/resources");
}

export function getResource(id) {
  return apiFetch(`/api/resources/${id}`);
}

export function createResource(payload) {
  return apiFetch("/api/resources", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateResource(id, payload) {
  return apiFetch(`/api/resources/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteResource(id) {
  return apiFetch(`/api/resources/${id}`, { method: "DELETE" });
}
