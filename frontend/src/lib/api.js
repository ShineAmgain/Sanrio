const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

async function request(path, options = {}) {
  const { token, ...fetchOptions } = options;
  const headers = { 'Content-Type': 'application/json', ...(fetchOptions.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${path}`, { ...fetchOptions, headers });
  if (response.status === 204) return null;
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || `Request failed (${response.status})`);
  return body;
}

export const api = {
  list: (resource) => request(`/${resource}`),
  get: (resource, id) => request(`/${resource}/${id}`),
  create: (resource, payload, token) => request(`/${resource}`, { method: 'POST', body: JSON.stringify(payload), token }),
  update: (resource, id, payload, token) => request(`/${resource}/${id}`, { method: 'PUT', body: JSON.stringify(payload), token }),
  remove: (resource, id, token) => request(`/${resource}/${id}`, { method: 'DELETE', token }),
};
