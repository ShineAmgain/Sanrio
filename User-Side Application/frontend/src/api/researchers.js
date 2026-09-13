import { apiFetch } from "./client";

export function getResearchers() {
  return apiFetch("/api/researchers");
}

export function getResearcher(id) {
  return apiFetch(`/api/researchers/${id}`);
}

export function createResearcher(payload) {
  return apiFetch("/api/researchers", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateResearcher(id, payload) {
  return apiFetch(`/api/researchers/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteResearcher(id) {
  return apiFetch(`/api/researchers/${id}`, { method: "DELETE" });
}
