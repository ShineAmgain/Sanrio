import { apiFetch } from "./client";

// "Grants" in the API maps to "Opportunities" in the UI.
export function getGrants() {
  return apiFetch("/api/grants");
}

export function getGrant(id) {
  return apiFetch(`/api/grants/${id}`);
}

export function createGrant(payload) {
  return apiFetch("/api/grants", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateGrant(id, payload) {
  return apiFetch(`/api/grants/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteGrant(id) {
  return apiFetch(`/api/grants/${id}`, { method: "DELETE" });
}
