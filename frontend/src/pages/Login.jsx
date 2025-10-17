import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const FIXED_USERNAME = "TE-20";
const FIXED_PASSWORD = "OfficeEz";
const AUTH_KEY = "auth.te20.session";

export default function Login({ onAuthed }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const ok = sessionStorage.getItem(AUTH_KEY) === "1";
    if (ok) navigate("/", { replace: true });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const u = username.trim();
      const p = password;
      if (u === FIXED_USERNAME && p === FIXED_PASSWORD) {
        sessionStorage.setItem(AUTH_KEY, "1");
        window.dispatchEvent(new CustomEvent("auth:login"));
        if (onAuthed) onAuthed();
        navigate("/", { replace: true });
        return;
      }
      setError("Invalid username or password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-sky-50 px-4">
      <div className="w-full max-w-md bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl shadow-xl p-6 sm:p-8">
        <div className="text-center mb-4">
          <div className="text-3xl sm:text-4xl font-extrabold tracking-wide text-yellow-400 drop-shadow-sm">OfficeEZ</div>
        </div>
        <p className="text-center text-slate-600 mb-6">Please sign in to continue</p>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input
              type="text"
              inputMode="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder="Enter username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder="Enter password"
            />
          </div>
          {error && (
            <div className="text-sm text-red-600" role="alert">{error}</div>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-sky-600 hover:bg-sky-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-medium py-2.5 mt-2"
          >
            {submitting ? "Signing in…" : "Sign In"}
          </button>
        </form>
        <p className="text-[11px] text-slate-500 text-center mt-4">Access is restricted to authorized users.</p>
      </div>
    </div>
  );
}


