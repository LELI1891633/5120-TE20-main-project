
// client.js

// Central API client for connecting the frontend to FastAPI.
// This file defines all fetch calls to your backend endpoints.
// Works locally and in production (Lambda via API Gateway).


//  Base URL configuration
//  Reads from environment variable if available
//  Falls back to local backend for dev testing
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8088";

// Small helper to handle responses
async function fetchJSON(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API Error ${res.status}: ${err}`);
  }
  return await res.json();
}

// Breaks
export async function fetchBreaks() {
  return fetchJSON(`${API_BASE_URL}/breaks`);
}



//  OFFICEEZ API CALLS


// Health checks
export async function checkHealth() {
  return fetchJSON(`${API_BASE_URL}/health`);
}

// Stress suggestion
export async function fetchStressSuggestion() {
  return fetchJSON(`${API_BASE_URL}/stress/suggestion`);
}

// Stretch random set
export async function fetchStretchRandomSet() {
  return fetchJSON(`${API_BASE_URL}/stretch/random-set`);
}

// Physical guidelines
export async function fetchGuidelines() {
  return fetchJSON(`${API_BASE_URL}/guidelines`);
}

// Workday activities
export async function fetchWorkdayActivities() {
  return fetchJSON(`${API_BASE_URL}/workday`);
}

// Tips (random)
export async function fetchRandomTip() {
  return fetchJSON(`${API_BASE_URL}/tips/random`);
}

// All tips (optionally filter by category)
export async function fetchTipsList(category = null, limit = 10) {
  const url = new URL(`${API_BASE_URL}/tips`);
  if (category) url.searchParams.append("category", category);
  url.searchParams.append("limit", limit);
  return fetchJSON(url);
}



// Eye health analysis (POST)
export async function analyzeEyeHealth(data) {
  return fetchJSON(`${API_BASE_URL}/api/eye-health/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

// Eye health user data save (POST)
export async function saveEyeHealthData(data) {
  return fetchJSON(`${API_BASE_URL}/api/eye-health/save-user-data`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}



// IT3: Social Connection & Wellbeing Endpoints


// Fetch connection score table (survey question scoring)
export async function fetchConnectionScores() {
  return fetchJSON(`${API_BASE_URL}/connection-scores`);
}

// Fetch loneliness trends by year
export async function fetchLonelinessTrend() {
  return fetchJSON(`${API_BASE_URL}/loneliness-trend`);
}

// Fetch score calculation bands (range → category)
export async function fetchConnectionBands() {
  return fetchJSON(`${API_BASE_URL}/connection-bands`);
}

// Fetch social connection insights
export async function fetchSocialConnectionInsights() {
  return fetchJSON(`${API_BASE_URL}/social-connection-insights`);
}

// Fetch volunteering trends
export async function fetchVolunteeringTrend() {
  return fetchJSON(`${API_BASE_URL}/volunteering-trend`);
}
