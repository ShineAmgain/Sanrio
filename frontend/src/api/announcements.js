import { apiFetch } from "./client";

export function getAnnouncements() {
  return apiFetch("/api/announcements");
}

export function getAnnouncement(id) {
  return apiFetch(`/api/announcements/${id}`);
}

export function createAnnouncement(payload) {
  return apiFetch("/api/announcements", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateAnnouncement(id, payload) {
  return apiFetch(`/api/announcements/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteAnnouncement(id) {
  return apiFetch(`/api/announcements/${id}`, { method: "DELETE" });
}
