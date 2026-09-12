// The single HTTP client every service file goes through.
// React never calls Supabase or the Python AI service directly —
// only this Node backend, at API_BASE_URL.
export const API_BASE_URL = "http://localhost:3000";

export async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  // Some endpoints (DELETE) return no body.
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error((data && data.error) || "API request failed");
  }

  return data;
}
