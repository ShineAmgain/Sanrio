import { apiFetch } from "./client";

export function getEthics() {
  return apiFetch("/api/ethics");
}

export function getEthicsEntry(id) {
  return apiFetch(`/api/ethics/${id}`);
}

export function createEthicsEntry(payload) {
  return apiFetch("/api/ethics", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateEthicsEntry(id, payload) {
  return apiFetch(`/api/ethics/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteEthicsEntry(id) {
  return apiFetch(`/api/ethics/${id}`, { method: "DELETE" });
}
