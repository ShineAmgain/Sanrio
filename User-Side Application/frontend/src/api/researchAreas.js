import { apiFetch } from "./client";

// Research Areas & Groups is called out in the brief as a structured,
// admin-manageable taxonomy (Computing, AI, Data Science, etc.) rather than
// free-text tags. Route not in the original API contract yet — built here
// the same way events/grants were, so no restructuring is needed once the
// backend route ships.
export function getResearchAreas() {
  return apiFetch("/api/research-areas");
}

export function getResearchArea(id) {
  return apiFetch(`/api/research-areas/${id}`);
}
