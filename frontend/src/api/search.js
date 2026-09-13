import { apiFetch } from "./client";

export async function semanticSearch(query) {
  const params = new URLSearchParams({ q: query });
  return apiFetch(`/api/search?${params.toString()}`);
}
