import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  Dumbbell,
  Timer,
  Pause,
  Play,
  SkipForward,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  ArrowLeft
} from "lucide-react";
import { AnimatedAssistant } from "../components/AnimatedAssistant";

/** < 5 minutes total (4:00) */
const STEPS = [
  {
    title: "Neck & Shoulder Rolls",
    duration: 45,
    cue: "Roll shoulders back ×5, forward ×5. Gentle neck circles within a comfy range."
  },
  {
    title: "Seated Spinal Twist",
    duration: 45,
    cue: "Sit tall. Twist to the right holding the chair back. Breathe. Switch sides halfway."
  },
  {
    title: "Chair Squats",
    duration: 60,
    cue: "Stand up and sit down with control. Chest tall. Comfortable pace."
  },
  {
    title: "Wrist & Ankle Circles",
    duration: 45,
    cue: "Circle wrists ~20s, then ankles. Reverse direction halfway."
  },
  {
    title: "Box Breathing",
    duration: 45,
    cue: "In 4 • Hold 4 • Out 4 • Hold 4. Repeat calmly."
  }
];

const totalDuration = STEPS.reduce((s, x) => s + x.duration, 0); // 240s ≈ 4:00

export default function ActivityReminder() {
  const navigate = useNavigate();

  const [assistantOpen, setAssistantOpen] = useState(true);
  const [showChallenge, setShowChallenge] = useState(false);

  // Timer state
  const [idx, setIdx] = useState(0);
  const [remaining, setRemaining] = useState(STEPS[0].duration);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const tickRef = useRef(null);

  // derived
  const elapsedTotal = useMemo(
    () =>
      STEPS.slice(0, idx).reduce((s, x) => s + x.duration, 0) +
      (STEPS[idx] ? STEPS[idx].duration - remaining : 0),
    [idx, remaining]
  );
  const progress = Math.min(100, Math.round((elapsedTotal / totalDuration) * 100));

  // countdown
  useEffect(() => {
    if (!running || completed) return;
    tickRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          if (idx < STEPS.length - 1) {
            setIdx((n) => n + 1);
            return STEPS[idx + 1].duration;
          } else {
            clearInterval(tickRef.current);
            setCompleted(true);
            setRunning(false);
            return 0;
          }
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(tickRef.current);
    
  }, [running, completed, idx]);

  // controls
  const start = () => setRunning(true);
  const pause = () => setRunning(false);
  const reset = () => {
    setIdx(0);
    setRemaining(STEPS[0].duration);
    setRunning(false);
    setCompleted(false);
  };
  const skip = () => {
    if (idx < STEPS.length - 1) {
      setIdx(idx + 1);
      setRemaining(STEPS[idx + 1].duration);
    } else {
      setCompleted(true);
      setRunning(false);
      setRemaining(0);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-blue-50 py-6 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute top-0 right-1/3 h-80 w-80 rounded-full bg-gradient-to-br from-sky-200/40 to-indigo-200/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-gradient-to-br from-blue-200/40 to-sky-200/40 blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 mx-auto mb-8 max-w-4xl">
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => navigate("/healthy-you")}
            className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/20 px-4 py-2 font-medium text-slate-700 shadow-sm backdrop-blur-md transition-all duration-200 hover:bg-white/30 hover:shadow-md"
          >
            <ArrowLeft size={16} />
            Back to Health Tips
          </button>1q 
        </div>

        <div className="text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-500 p-4">
              <Activity className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 sm:text-4xl">
              Movement Challenge
            </h1>
          </div>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            A guided <span className="font-semibold">under 5 minutes</span> desk-friendly routine to reset posture,
            boost circulation, and refresh your focus.
          </p>
        </div>
      </div>

      {/* Main */}
      <div className="relative z-10 mx-auto max-w-4xl space-y-8">
        {/* Overview / Start Card */}
        {!showChallenge && (
          <div className="rounded-3xl border border-white/30 bg-white/20 p-8 shadow-xl backdrop-blur-md">
            <div className="mb-6 flex items-center gap-3">
              <Dumbbell className="text-indigo-600" size={24} />
              <h2 className="text-2xl font-bold text-slate-800">Physical Activity</h2>
            </div>

            <div className="rounded-lg bg-white p-4 shadow-sm">
              <p className="mb-3 text-slate-700">
                Complete the following steps:
              </p>
              <ul className="divide-y divide-dashed divide-slate-200">
                {STEPS.map((s) => (
                  <li key={s.title} className="flex items-center justify-between py-2 text-sm">
                    <span className="font-medium text-slate-800">{s.title}</span>
                    <span className="text-slate-500">{formatSec(s.duration)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 text-right text-sm text-slate-600">
                Total time: <span className="font-semibold">{formatSec(totalDuration)}</span>
              </div>
            </div>

            <button
              onClick={() => setShowChallenge(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:brightness-105 hover:shadow-xl"
            >
              <Play size={18} />
              Start Movement Challenge
            </button>
          </div>
        )}

        {/* Guided Activity Card */}
        {showChallenge && (
          <div className="rounded-3xl border border-white/30 bg-white/20 p-8 shadow-xl backdrop-blur-md">
            {/* Completed banner */}
            {completed ? (
              <div className="mb-4 rounded-lg border border-green-200 bg-green-100 p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-800">
                    Great job! You’ve completed the 4-minute Movement Challenge. 🎉
                  </span>
                </div>
              </div>
            ) : null}

            {/* Header */}
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <Timer className="text-blue-600" size={24} />
                <h2 className="text-2xl font-bold text-slate-800">
                  {STEPS[idx].title}
                </h2>
              </div>
              <div className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs text-slate-700">
                Step {idx + 1} / {STEPS.length}
              </div>
            </div>

            {/* Cues */}
            <p className="mb-4 text-slate-700">{STEPS[idx].cue}</p>

            {/* Timer + Progress */}
            <div className="grid gap-3">
              <div className="text-center text-5xl font-mono font-bold text-slate-800">
                {formatSec(remaining)}
              </div>

              <div className="h-2 w-full rounded-full bg-slate-200" aria-label={`Overall progress ${progress}%`}>
                <div
                  className="h-2 rounded-full bg-indigo-600 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="text-center text-sm text-slate-600">
                Total: {formatSec(elapsedTotal)} / {formatSec(totalDuration)}
              </div>
            </div>

            {/* Controls */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              {!running ? (
                <button
                  onClick={start}
                  className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 font-medium text-white shadow-lg transition-all hover:brightness-105 hover:shadow-xl"
                >
                  <Play size={18} />
                  Start
                </button>
              ) : (
                <button
                  onClick={pause}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 font-medium text-white shadow-lg transition-all hover:brightness-105 hover:shadow-xl"
                >
                  <Pause size={18} />
                  Pause
                </button>
              )}

              <button
                onClick={skip}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 font-medium text-slate-900 ring-1 ring-slate-200 transition-all hover:bg-slate-200"
              >
                <SkipForward size={18} />
                Skip
              </button>

              <button
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 font-medium text-slate-900 ring-1 ring-slate-200 transition-all hover:bg-slate-200"
              >
                <RotateCcw size={18} />
                Reset
              </button>

              <button
                onClick={() => { setShowChallenge(false); reset(); }}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 font-medium text-slate-900 ring-1 ring-slate-200 transition-all hover:bg-slate-200"
              >
                Close
              </button>
            </div>

            {/* Tip */}
            {!completed && (
              <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <span className="text-slate-800">
                    Move within a comfortable range. If anything hurts, skip or modify the step.
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Animated Assistant */}
      <AnimatedAssistant
        open={assistantOpen}
        name="Movement Coach"
        position="bottom-right"
        accent="indigo"
        steps={[
          { text: "Welcome to the Movement Challenge! 💪" },
          { text: "You’ll complete 5 short steps in under 5 minutes." },
          { text: "Follow the cues, hit Start, and you can Pause/Skip any time." },
          { text: "Ready? Let’s reset posture and boost your energy!" }
        ]}
        onClose={() => setAssistantOpen(false)}
      />
    </div>
  );
}

/* utils */
function formatSec(s) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}
