// src/pages/BreathingGame.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Info, Wind, Play, Pause, RotateCcw } from "lucide-react";

export default function BreathingGame() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-sky-50">
      <header className="mx-auto max-w-5xl px-4 pt-4 pb-3 flex items-center justify-between">
        <button
          onClick={() => navigate("/stress-buster")}
          className="inline-flex items-center gap-2 rounded-lg border border-white/40 bg-white/30 px-3 py-2 text-slate-700 shadow-sm backdrop-blur-md hover:bg-white/50"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <button
          onClick={() => navigate("/health-info")}
          className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-3 py-2 text-white shadow-md hover:bg-sky-700"
        >
          <Info size={16} /> <span className="hidden sm:inline">Health Info</span>
        </button>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl bg-indigo-100 p-2"><Wind className="text-indigo-600" size={20} /></div>
          <h1 className="text-2xl font-semibold">Breathing Circle</h1>
        </div>
        <div className="rounded-3xl border border-white/40 bg-white/70 p-6 shadow-xl backdrop-blur-md">
          <BreathingCircle />
        </div>
      </main>
    </div>
  );
}

function BreathingCircle() {
  const PHASES = useMemo(
    () => [
      { name: "Inhale", dir: +1, color: "text-emerald-600" },
      { name: "Hold",   dir:  0, color: "text-sky-600"     },
      { name: "Exhale", dir: -1, color: "text-indigo-600"  },
      { name: "Hold",   dir:  0, color: "text-sky-600"     },
    ],
    []
  );
  const SEG_MS = 5000;  // 5s per phase
  const TICK_MS = 100;

  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState(0);
  const [msLeft, setMsLeft] = useState(SEG_MS);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!running) return;
    timerRef.current = setInterval(() => {
      setMsLeft((m) => (m <= TICK_MS ? SEG_MS : m - TICK_MS));
      setPhase((p) => (msLeft <= TICK_MS ? (p + 1) % PHASES.length : p));
      setProgress((prev) => {
        const { dir } = PHASES[phase];
        if (dir === 0) return prev;
        const delta = (TICK_MS / SEG_MS) * dir;
        return Math.max(0, Math.min(1, prev + delta));
      });
    }, TICK_MS);
    return () => clearInterval(timerRef.current);
  }, [running, phase, msLeft, PHASES]);

  useEffect(() => {
    const { dir } = PHASES[phase];
    if (dir === 0) setProgress(phase === 1 ? 1 : 0);
    else if (phase === 0) setProgress(0);
    else if (phase === 2) setProgress(1);
  }, [phase, PHASES]);

  const start = () => setRunning(true);
  const pause = () => setRunning(false);
  const reset = () => { setRunning(false); setPhase(0); setMsLeft(SEG_MS); setProgress(0); };

  const R = 90, CIRC = 2 * Math.PI * R;
  const offset = CIRC * (1 - progress);
  const current = PHASES[phase];

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 220 220" className="w-48 h-48 sm:w-56 sm:h-56 drop-shadow mx-auto" aria-label="Breathing ring">
        <circle cx="110" cy="110" r="90" fill="none" stroke="#e5e7eb" strokeWidth="12" />
        <circle cx="110" cy="110" r="90" fill="none" stroke="#6366f1" strokeWidth="12" strokeLinecap="round"
                strokeDasharray={CIRC} strokeDashoffset={offset}
                style={{ transition: `stroke-dashoffset ${TICK_MS}ms linear` }} />
        <g transform="translate(110,110)">
          <circle r={40} fill="#ffffff" stroke="#c7d2fe" strokeWidth="2"
                  style={{ transformOrigin: "center", transform: `scale(${0.95 + progress * 0.15})`, transition: `transform ${TICK_MS}ms linear` }} />
        </g>
      </svg>

      <div className="mt-3 text-center">
        <div className={`text-lg font-semibold ${current.color}`}>{current.name}</div>
        <div className="text-sm text-slate-600">{Math.ceil(msLeft / 1000)}s</div>
      </div>

      <div className="mt-4 flex gap-2">
        {!running ? (
          <button onClick={start} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-white shadow hover:brightness-105"><Play size={16}/> Start</button>
        ) : (
          <button onClick={pause} className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-white shadow hover:brightness-105"><Pause size={16}/> Pause</button>
        )}
        <button onClick={reset} className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-slate-900 ring-1 ring-slate-200 hover:bg-slate-200">
          <RotateCcw size={16}/> Reset
        </button>
      </div>

      <p className="mt-4 text-center text-sm text-slate-600">
        Inhale as the ring grows • Hold • Exhale as it shrinks • Hold. Repeat 1–2 minutes.
      </p>
    </div>
  );
}
