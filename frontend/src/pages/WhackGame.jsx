import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Info, Target, Play, Pause, RotateCcw } from "lucide-react";

export default function WhackGame() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      {/* Header */}
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

      {/* Main */}
      <main className="mx-auto max-w-5xl px-4 pb-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl bg-rose-100 p-2">
            <Target className="text-rose-600" size={20} />
          </div>
          <h1 className="text-2xl font-semibold">Whack-a-Cube</h1>
        </div>

        <div className="rounded-3xl border border-white/40 bg-white/70 p-6 shadow-xl backdrop-blur-md">
          <WhackBoard />
        </div>
      </main>
    </div>
  );
}

function WhackBoard() {
  const GRID = 4;
  const CELLS = GRID * GRID;
  const ROUND_SECONDS = 30;
  const INITIAL_SPEED_MS = 1200;
  const MIN_SPEED_MS = 700;

  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [score, setScore] = useState(0);
  const [active, setActive] = useState(null);
  const [speed, setSpeed] = useState(INITIAL_SPEED_MS);

  const timerRef = useRef(null);
  const hopRef = useRef(null);
  const prevRef = useRef(null);

  const whackSound = useRef(new Audio("/sounds/pop1.mp3"));

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
        let next;
        do {
          next = Math.floor(Math.random() * CELLS);
        } while (next === prevRef.current);
        prevRef.current = next;
        return next;
      });
    }, speed);
    return () => clearInterval(hopRef.current);
  }, [running, speed]);

  const playSound = () => {
    const sound = whackSound.current;
    sound.currentTime = 0;
    sound.volume = 0.8;
    sound.play().catch(() => {});
  };

  const hit = (i) => {
    if (!running) return;
    if (i === active) {
      setScore((s) => s + 1);
      playSound();
      setActive(null);
      setSpeed((ms) => Math.max(MIN_SPEED_MS, ms - 10));
    }
  };

  const start = () => {
    setRunning(true);
    setTimeLeft(ROUND_SECONDS);
    setScore(0);
    setActive(null);
    setSpeed(INITIAL_SPEED_MS);
  };
  const pause = () => setRunning(false);
  const reset = () => {
    setRunning(false);
    setTimeLeft(ROUND_SECONDS);
    setScore(0);
    setActive(null);
    setSpeed(INITIAL_SPEED_MS);
  };

  return (
    <div>
      {/* Score and Timer */}
      <div className="mb-3 flex items-center justify-between">
        <div className="rounded-xl bg-rose-50 px-3 py-1 text-rose-700 ring-1 ring-rose-200">
          Score: <span className="font-semibold">{score}</span>
        </div>
        <div className="rounded-xl bg-slate-50 px-3 py-1 text-slate-700 ring-1 ring-slate-200">
          Time: <span className="font-semibold">{timeLeft}s</span>
        </div>
      </div>

      {/* Board - responsive grid fits small screens */}
      <div
        className="grid grid-cols-4 gap-3 w-full max-w-[420px] mx-auto"
      >
        {Array.from({ length: CELLS }).map((_, i) => (
          <button
            key={i}
            onClick={() => hit(i)}
            className="relative rounded-2xl bg-white/70 ring-1 ring-slate-200 shadow-inner hover:bg-white transition-colors aspect-square w-full"
          >
            <div
              className={`absolute inset-0 grid place-items-center transition-transform duration-200 ${
                i === active ? "scale-100 translate-y-0" : "scale-0 translate-y-6"
              }`}
            >
              <Cube3D />
            </div>
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {!running ? (
          <button
            onClick={start}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-white shadow hover:brightness-105"
          >
            <Play size={16} /> Start
          </button>
        ) : (
          <button
            onClick={pause}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-white shadow hover:brightness-105"
          >
            <Pause size={16} /> Pause
          </button>
        )}
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-slate-900 ring-1 ring-slate-200 hover:bg-slate-200"
        >
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {!running && timeLeft === 0 && (
        <p className="mt-3 text-sm text-slate-600">
          Round over — great job! Click <span className="font-medium">Start</span> to play again.
        </p>
      )}
    </div>
  );
}


function Cube3D() {
  return (
    <div className="relative w-[70%] h-[70%] max-w-[70px] max-h-[70px] min-w-[44px] min-h-[44px] rounded-lg bg-gradient-to-br from-rose-400 to-pink-600 shadow-[inset_0_3px_5px_rgba(255,255,255,0.5),0_6px_12px_rgba(0,0,0,0.25)] transition-all duration-200 hover:brightness-110">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/25 to-transparent rounded-lg"></div>
      <div className="absolute bottom-0 left-0 w-full h-2 bg-black/20 rounded-b-lg"></div>
    </div>
  );
}