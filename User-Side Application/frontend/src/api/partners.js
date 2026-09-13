import { apiFetch } from "./client";

export function getPartners() {
  return apiFetch("/api/partners");
}

export function getPartner(id) {
  return apiFetch(`/api/partners/${id}`);
}

export function createPartner(payload) {
  return apiFetch("/api/partners", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updatePartner(id, payload) {
  return apiFetch(`/api/partners/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deletePartner(id) {
  return apiFetch(`/api/partners/${id}`, { method: "DELETE" });
}
