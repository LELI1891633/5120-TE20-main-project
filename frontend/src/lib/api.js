// Prefer VITE_API_BASE if present; fallback to VITE_API_BASE_URL; then window var; else localhost
export const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_URL))
  ? (import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_URL)
  : (typeof window !== 'undefined' && window.__API_BASE_URL__) || 'http://127.0.0.1:8000';

export async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const merged = {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  };
  const res = await fetch(url, merged);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Request failed ${res.status}: ${text || res.statusText}`);
  }
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return res.json();
  }
  return res.text();
}

// ---- Sedentary APIs ----
export async function getSedentarySummary(year = 2022) {
  return request(`/api/activity/sedentary/summary?year=${encodeURIComponent(year)}`);
}

export async function getSedentaryBreakdown(year = 2022) {
  return request(`/api/activity/sedentary/breakdown?year=${encodeURIComponent(year)}`);
}

