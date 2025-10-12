import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity, Dumbbell, Timer, Pause, Play, SkipForward, RotateCcw,
  CheckCircle, AlertTriangle, ArrowLeft, Info
} from "lucide-react";
import { AnimatedAssistant } from "../components/AnimatedAssistant";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function ActivityReminder() {
  const navigate = useNavigate();

  const [assistantOpen, setAssistantOpen] = useState(true);
  const [showChallenge, setShowChallenge] = useState(false);

  // Data
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Timer state
  const [idx, setIdx] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const tickRef = useRef(null);

  // Fetch steps from backend
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/stretch/random-set`, {
          headers: { "Content-Type": "application/json" },
          });
        if (!res.ok) throw new Error(`API ${res.status}`);
        const data = await res.json();

        // normalize: accept duration or duration_min fields
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.items)
          ? data.items
          : [];

        const normalized = list.map((d, i) => ({
          id: d.id ?? i + 1,
          title: d.area_name || d.site_name || `Step ${i + 1}`,
          duration: 45, // since DB doesn’t have duration field, default to 45 sec per step
          cue: d.steps || "",
        }));

        if (!ignore) {
          setSteps(normalized);
          setIdx(0);
          setRemaining(normalized[0]?.duration ?? 0);
        }
       } catch (e) {
          if (!ignore) {
            setErr(e.message || "Failed to load");
            setSteps([]);
          }
        }
       finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  // derived
  const totalDuration = useMemo(
    () => steps.reduce((s, x) => s + (x.duration || 0), 0),
    [steps]
  );

  const elapsedTotal = useMemo(() => {
    if (!steps.length) return 0;
    const done = steps.slice(0, idx).reduce((s, x) => s + x.duration, 0);
    const current = steps[idx] ? steps[idx].duration - remaining : 0;
    return done + Math.max(0, current);
  }, [steps, idx, remaining]);

  const progress = useMemo(() => {
    if (!totalDuration) return 0;
    return Math.min(100, Math.round((elapsedTotal / totalDuration) * 100));
  }, [elapsedTotal, totalDuration]);

  // countdown
  useEffect(() => {
    if (!running || completed || !steps.length) return;
    tickRef.current = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          if (idx < steps.length - 1) {
            setIdx(n => n + 1);
            return steps[idx + 1].duration;
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
  }, [running, completed, idx, steps]);

  // controls
  const start = () => setRunning(true);
  const pause = () => setRunning(false);
  const reset = () => {
    setIdx(0);
    setRemaining(steps[0]?.duration ?? 0);
    setRunning(false);
    setCompleted(false);
  };
  const skip = () => {
    if (idx < steps.length - 1) {
      setIdx(idx + 1);
      setRemaining(steps[idx + 1].duration);
    } else {
      setCompleted(true);
      setRunning(false);
      setRemaining(0);
    }
  };

  // helpers
  const safeStep = steps[idx];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-blue-50 py-6 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute top-0 right-1/3 h-80 w-80 rounded-full bg-gradient-to-br from-sky-200/40 to-indigo-200/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-gradient-to-br from-blue-200/40 to-sky-200/40 blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 mx-auto mb-8 max-w-4xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <button
            onClick={() => navigate("/healthy-you")}
            className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/20 px-4 py-2 font-medium text-slate-700 shadow-sm backdrop-blur-md transition-all duration-200 hover:bg-white/30 hover:shadow-md"
          >
            <ArrowLeft size={16} />
            Back to Health Tips
          </button>
          <button
            onClick={() => navigate("/health-info")}
            className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-3 py-2 text-white shadow-md transition-colors hover:bg-sky-700"
            aria-label="Open Health Info"
            title="Open Health Info"
          >
            <Info size={16} />
            <span className="hidden sm:inline">Health Info</span>
          </button>
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
        {/* Loading / Error */}
        {loading && (
          <div className="rounded-3xl border border-white/30 bg-white/20 p-8 shadow-xl backdrop-blur-md">
            Loading activities…
          </div>
        )}

        {!loading && !steps.length && (
          <div className="rounded-3xl border border-white/30 bg-white/20 p-8 shadow-xl backdrop-blur-md">
            Couldn’t load activities.
            {err ? <div className="mt-2 text-sm text-red-600">Error: {err}</div> : null}
          </div>
        )}

        {/* Overview / Start Card */}
        {!loading && steps.length > 0 && !showChallenge && (
          <div className="rounded-3xl border border-white/30 bg-white/20 p-8 shadow-xl backdrop-blur-md">
            <div className="mb-6 flex items-center gap-3">
              <Dumbbell className="text-indigo-600" size={24} />
              <h2 className="text-2xl font-bold text-slate-800">Physical Activity</h2>
            </div>

            <div className="rounded-lg bg-white p-4 shadow-sm">
              <p className="mb-3 text-slate-700">Complete the following steps:</p>
              <ul className="divide-y divide-dashed divide-slate-200">
                {steps.map((s) => (
                  <li key={s.id ?? s.title} className="flex items-center justify-between py-2 text-sm">
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
        {!loading && steps.length > 0 && showChallenge && (
          <div className="rounded-3xl border border-white/30 bg-white/20 p-8 shadow-xl backdrop-blur-md">
            {/* Completed banner */}
            {completed ? (
              <div className="mb-4 rounded-lg border border-green-200 bg-green-100 p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-800">
                    Great job! You’ve completed the Movement Challenge. 🎉
                  </span>
                </div>
              </div>
            ) : null}

            {/* Header */}
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <Timer className="text-blue-600" size={24} />
                <h2 className="text-2xl font-bold text-slate-800">
                  {safeStep?.title ?? "Step"}
                </h2>
              </div>
              <div className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs text-slate-700">
                Step {Math.min(idx + 1, steps.length)} / {steps.length}
              </div>
            </div>

            {/* Cues */}
            <p className="mb-4 text-slate-700">{safeStep?.cue}</p>

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
          { text: "You’ll complete short steps in under 5 minutes." },
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
