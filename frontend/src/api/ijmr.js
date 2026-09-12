import { apiFetch } from "./client";

export function getIjmr() {
  return apiFetch("/api/ijmr");
}

export function getIjmrLink(id) {
  return apiFetch(`/api/ijmr/${id}`);
}

export function createIjmrLink(payload) {
  return apiFetch("/api/ijmr", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateIjmrLink(id, payload) {
  return apiFetch(`/api/ijmr/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteIjmrLink(id) {
  return apiFetch(`/api/ijmr/${id}`, { method: "DELETE" });
}
