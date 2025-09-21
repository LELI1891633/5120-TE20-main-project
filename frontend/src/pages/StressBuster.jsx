// src/pages/StressBuster.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flower2, Info, Play, Sparkles, Wind, Gamepad2, Target } from "lucide-react";

export default function StressBuster() {
  const navigate = useNavigate();
  const [tip, setTip] = useState("");

  const tips = [
    "Try 4-4-4-4 box breathing for one minute.",
    "Unclench your jaw, drop your shoulders, and exhale slowly.",
    "Stand up, roll your shoulders, and take 5 deep breaths.",
    "Look far away for 20 seconds to reset focus.",
    "Sip water and make your exhale slightly longer than inhale.",
  ];
  const getTip = () => {
    setTip(tips[Math.floor(Math.random() * tips.length)]);
    setTimeout(() => setTip(""), 6000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50">
      <div className="mx-auto max-w-5xl px-4 py-6">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-sky-100 p-2">
              <Flower2 className="text-sky-700" size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">Stress-buster</h1>
              <p className="text-sm text-slate-600">Short, calm activities you can start instantly — no login, no data.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/health-info")}
              className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-3 py-2 text-white shadow-md hover:bg-sky-700"
            >
              <Info size={16} /> <span className="hidden sm:inline">Health Info</span>
            </button>
            <button
              onClick={getTip}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-2 text-white shadow-md hover:bg-emerald-700"
            >
              <Sparkles size={16} /> Get tip to remove stress
            </button>
          </div>
        </div>

        {tip && (
          <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-900">{tip}</div>
        )}

        {/* 2×2 uniform grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card
            gradient="from-indigo-500 to-blue-500"
            icon={<Wind size={18} />}
            title="Breathing Circle"
            subtitle="Box breathing: In 4s • Hold 4s • Out 4s • Hold 4s"
            onPlay={() => navigate("/stress-buster/breathing")}
          />
          <Card
            gradient="from-cyan-500 to-sky-500"
            icon={<Gamepad2 size={18} />}
            title="Bubble Pop"
            subtitle="Tap bubbles to pop them. Simple and satisfying."
            onPlay={() => navigate("/stress-buster/bubbles")}
          />
          <Card
            gradient="from-rose-500 to-pink-500"
            icon={<Target size={18} />}
            title="Whack-a-Character"
            subtitle="Tap the critter when it appears. 30-second round."
            onPlay={() => navigate("/stress-buster/whack")}
          />
          <Card
            gradient="from-purple-500 to-fuchsia-500"
            icon={<Flower2 size={18} />}
            title="Sandspiel (Sandbox)"
            subtitle="A soothing falling-sand simulation — opens full page."
            onPlay={() => navigate("/stress-buster/sand")}
          />
        </div>
      </div>
    </div>
  );
}

/* Uniform card (fixed height) */
function Card({ gradient, icon, title, subtitle, onPlay }) {
  return (
    <div className="rounded-3xl border border-white/30 bg-white/60 shadow-xl backdrop-blur-md overflow-hidden">
      <div className="relative h-[18rem] sm:h-[19rem] lg:h-[20rem] flex flex-col">
        <div className={`p-5 text-white bg-gradient-to-r ${gradient}`}>
          <div className="inline-flex items-center gap-3">
            <div className="rounded-xl bg-white/20 p-2">{icon}</div>
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
          <p className="mt-1 text-white/90 text-sm">{subtitle}</p>
        </div>

        <div className="flex flex-1 flex-col justify-between p-5">
          <div className="rounded-2xl bg-slate-50 p-3 text-xs text-slate-600 ring-1 ring-slate-200">
            This is a quick, self-guided activity. No data is collected or saved.
          </div>
          <button
            onClick={onPlay}
            className="mt-3 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-white shadow hover:brightness-105"
          >
            <Play size={16} /> Play
          </button>
        </div>
      </div>
    </div>
  );
}
