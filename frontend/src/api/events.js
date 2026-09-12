import { apiFetch } from "./client";

export function getEvents() {
  return apiFetch("/api/events");
}

export function getEvent(id) {
  return apiFetch(`/api/events/${id}`);
}

export function createEvent(payload) {
  return apiFetch("/api/events", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateEvent(id, payload) {
  return apiFetch(`/api/events/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteEvent(id) {
  return apiFetch(`/api/events/${id}`, { method: "DELETE" });
}
