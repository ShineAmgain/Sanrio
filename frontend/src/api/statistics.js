import { apiFetch } from "./client";

export function getStatistics() {
  return apiFetch("/api/statistics");
}

export function getStatisticEntry(id) {
  return apiFetch(`/api/statistics/${id}`);
}

export function createStatisticEntry(payload) {
  return apiFetch("/api/statistics", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateStatisticEntry(id, payload) {
  return apiFetch(`/api/statistics/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteStatisticEntry(id) {
  return apiFetch(`/api/statistics/${id}`, { method: "DELETE" });
}
