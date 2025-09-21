// src/pages/WhackGame.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Info, Target, Play, Pause, RotateCcw } from "lucide-react";

export default function WhackGame() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
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
          <div className="rounded-2xl bg-rose-100 p-2"><Target className="text-rose-600" size={20} /></div>
          <h1 className="text-2xl font-semibold">Whack-a-Character</h1>
        </div>

        <div className="rounded-3xl border border-white/40 bg-white/70 p-6 shadow-xl backdrop-blur-md">
          <WhackBoard />
        </div>
      </main>
    </div>
  );
}

function WhackBoard() {
  const GRID = 4, CELLS = GRID * GRID, ROUND_SECONDS = 30;
  const CELL = 80;                     // px per square (tweak)
  const INITIAL_SPEED_MS = 1300, MIN_SPEED_MS = 750;

  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [score, setScore] = useState(0);
  const [active, setActive] = useState(null);
  const [speed, setSpeed] = useState(INITIAL_SPEED_MS);
  const timerRef = useRef(null), hopRef = useRef(null), prevRef = useRef(null);

  useEffect(() => {
    if (!running) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => (t <= 1 ? (setRunning(false), setActive(null), 0) : t - 1));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [running]);

  useEffect(() => {
    if (!running) return;
    hopRef.current = setInterval(() => {
      setActive(() => {
        let next; do { next = Math.floor(Math.random() * CELLS); } while (next === prevRef.current);
        prevRef.current = next; return next;
      });
    }, speed);
    return () => clearInterval(hopRef.current);
  }, [running, speed]);

  const hit = (i) => {
    if (!running) return;
    if (i === active) {
      setScore((s) => s + 1);
      setActive(null);
      setSpeed((ms) => Math.max(MIN_SPEED_MS, ms - 8));
    }
  };
  const start = () => { setRunning(true); setTimeLeft(ROUND_SECONDS); setScore(0); setActive(null); setSpeed(INITIAL_SPEED_MS); };
  const pause = () => setRunning(false);
  const reset = () => { setRunning(false); setTimeLeft(ROUND_SECONDS); setScore(0); setActive(null); setSpeed(INITIAL_SPEED_MS); };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="rounded-xl bg-rose-50 px-3 py-1 text-rose-700 ring-1 ring-rose-200">Score: <span className="font-semibold">{score}</span></div>
        <div className="rounded-xl bg-slate-50 px-3 py-1 text-slate-700 ring-1 ring-slate-200">Time: <span className="font-semibold">{timeLeft}s</span></div>
      </div>

<div
        className="grid gap-3 w-fit mx-auto"              
        style={{ gridTemplateColumns: `repeat(${GRID}, ${CELL}px)` }}
        aria-label="Whack board"
      >        {Array.from({ length: CELLS }).map((_, i) => (
<button
           key={i}
            onClick={() => hit(i)}
            style={{ width: CELL, height: CELL }}             
           className="relative rounded-2xl bg-white/70 ring-1 ring-slate-200 shadow-inner hover:bg-white transition-colors"
            aria-label={i === active ? "Whack!" : "Empty"}
          >            
          <div className={`absolute inset-0 grid place-items-center transition-transform duration-150 ${i === active ? "scale-100" : "scale-0"}`}>
              <Critter />
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {!running ? (
          <button onClick={start} className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-white shadow hover:brightness-105"><Play size={16}/> Start</button>
        ) : (
          <button onClick={pause} className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-white shadow hover:brightness-105"><Pause size={16}/> Pause</button>
        )}
        <button onClick={reset} className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-slate-900 ring-1 ring-slate-200 hover:bg-slate-200">
          <RotateCcw size={16}/> Reset
        </button>
      </div>

      {!running && timeLeft === 0 && (
        <p className="mt-3 text-sm text-slate-600">Round over — nice work! Click <span className="font-medium">Start</span> to play again.</p>
      )}
    </div>
  );
}

function Critter() {
  return (
    <svg viewBox="0 0 80 80" width="64" height="64" className="drop-shadow">
      <defs><radialGradient id="body" cx="50%" cy="45%"><stop offset="0%" stopColor="#fff5f7" /><stop offset="100%" stopColor="#fecdd3" /></radialGradient></defs>
      <circle cx="40" cy="40" r="28" fill="url(#body)" stroke="#fb7185" strokeWidth="2" />
      <circle cx="32" cy="36" r="3" fill="#0f172a" /><circle cx="48" cy="36" r="3" fill="#0f172a" />
      <path d="M30 48 C 40 56, 50 56, 50 48" fill="none" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
      <circle cx="24" cy="24" r="8" fill="#fecdd3" stroke="#fb7185" strokeWidth="2" />
      <circle cx="56" cy="24" r="8" fill="#fecdd3" stroke="#fb7185" strokeWidth="2" />
    </svg>
  );
}
