const API_BASE = import.meta.env.VITE_API_BASE;

export async function fetchBreaks() {
  const res = await fetch(`${API_BASE}/breaks`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`Backend ${res.status}`);
  return res.json();
}