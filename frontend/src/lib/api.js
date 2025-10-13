// // src/lib/api.js


// src/lib/api.js
// src/lib/api.js
export const API_BASE =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) ||
  'http://127.0.0.1:8088';

export async function request(path, options = {}) {
  const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;

  // 🔊 DEBUG LOGS
  console.groupCollapsed(`[request] ${options.method || 'GET'} ${url}`);
  console.log('API_BASE =', API_BASE);
  console.log('options =', options);
  console.groupEnd();

  const merged = {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  };

  try {
    const res = await fetch(url, merged);

    //  More logs
    console.groupCollapsed(`[response] ${res.status} ${url}`);
    console.log('status:', res.status, res.statusText);
    console.log('headers:', Object.fromEntries(res.headers.entries()));
    console.groupEnd();

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      // surface body so we see 400/422 details
      throw new Error(`HTTP ${res.status} ${res.statusText} — ${text}`);
    }

    const ct = res.headers.get('content-type') || '';
    return ct.includes('application/json') ? res.json() : res.text();
  } catch (err) {
    console.error('[request] fetch error:', err);
    throw err;
  }
}




// // Prefer VITE_API_BASE (or VITE_API_BASE_URL); then window var; else localhost:8088
// export const API_BASE =
//   (typeof import.meta !== "undefined" &&
//     import.meta.env &&
//     (import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_URL)) ||
//   (typeof window !== "undefined" && window.__API_BASE_URL__) ||
//   "http://127.0.0.1:8088"; // <-- use 8088 as the safe default

// function joinUrl(base, path) {
//   if (!path) return base;
//   return `${base}${path.startsWith("/") ? path : `/${path}`}`;
// }

// export async function request(path, options = {}) {
//   const url = joinUrl(API_BASE, path);
//   const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
//   const res = await fetch(url, { ...options, headers });
//   if (!res.ok) {
//     const text = await res.text().catch(() => "");
//     throw new Error(`Request failed ${res.status}: ${text || res.statusText}`);
//   }
//   const contentType = res.headers.get("content-type") || "";
//   return contentType.includes("application/json") ? res.json() : res.text();
// }

// // ---- Sedentary APIs ----
// export async function getSedentarySummary(year = 2022) {
//   return request(`/api/activity/sedentary/summary?year=${encodeURIComponent(year)}`);
// }
// export async function getSedentaryBreakdown(year = 2022) {
//   return request(`/api/activity/sedentary/breakdown?year=${encodeURIComponent(year)}`);
// }

// // ---- Eye model helpers ----
// export const CLASS_LABELS = { 0: "low", 1: "moderate", 2: "high" };

// export function formatAssessment(apiResp) {
//   const raw = String(apiResp.predicted_class); // "0" | "1" | "2"
//   const riskLabel = CLASS_LABELS[raw] ?? raw;

//   const probs = Object.entries(apiResp.probabilities || {})
//     .map(([k, v]) => ({ label: CLASS_LABELS[k] ?? k, p: Number(v) }))
//     .sort((a, b) => b.p - a.p)
//     .map(({ label, p }) => ({ label, pct: Math.round(p * 1000) / 10 })); // 0.1%

//   return { riskLabel, probs, message: apiResp.message || "" };
// }

// export async function assessEye(payload) {
//   return request("/eye/assess", {
//     method: "POST",
//     body: JSON.stringify(payload),
//   });
// }
