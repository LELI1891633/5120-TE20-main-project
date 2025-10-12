import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Smile, Meh, Frown, Zap, Sparkles } from "lucide-react";

export default function MoodAnalysis({ onBack }) {
  const [mood, setMood] = useState("");
  const [bgGradient, setBgGradient] = useState("from-sky-50 to-indigo-50");
  const [message, setMessage] = useState("");


  

  // Scroll to center whenever mood changes
  useEffect(() => {
    if (mood) {
      window.scrollTo({
        top: 200,
        behavior: "smooth",
      });
    }
  }, [mood]);

  const moods = [
    { name: "Stressed", color: "from-rose-200 to-rose-400", icon: <Frown /> },
    { name: "Low Mood", color: "from-blue-200 to-blue-400", icon: <Meh /> },
    { name: "Energized", color: "from-yellow-200 to-yellow-400", icon: <Zap /> },
    { name: "Neutral", color: "from-green-200 to-green-400", icon: <Smile /> },
  ];

  const handleMood = (m) => {
    setMood(m.name);
    setBgGradient(m.color);
    setMessage(`Thanks for sharing, it's okay to feel ${m.name.toLowerCase()} today.`);
  };

  const recommendations = {
    Stressed: [
      { text: "Play Stress Buster Game", link: "/stress-buster" },
      { text: "Try Breathing Exercise", link: "/breathing-game" },
    ],
    "Low Mood": [
      { text: "Pop Some Bubbles", link: "/bubble-pop-game" },
      { text: "Read Positivity Tips", link: "/healthy-you" },
    ],
    Energized: [
      { text: "Track Hydration", link: "/hydration-reminder" },
      { text: "Stretch or Walk Break", link: "/activity-reminder" },
    ],
    Neutral: [
      { text: "Explore Wellbeing Insights", link: "/healthy-you" },
      { text: "Play Sand Game", link: "/sand-game" },
    ],
  };

  return (
    <div
      className={`relative min-h-screen transition-all duration-700 bg-gradient-to-br ${bgGradient} py-4 px-6 flex items-center justify-center overflow-hidden`}
    >
      {/* Soft animated background */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-gradient-to-br from-fuchsia-200 to-pink-200 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/3 h-80 w-80 rounded-full bg-gradient-to-br from-blue-200 to-sky-200 blur-3xl animate-pulse" />
      </div>

      {/* Main content */}
        <div className="relative z-10 w-full max-w-4xl rounded-3xl border border-white/40 bg-white/40 p-6 shadow-2xl backdrop-blur-md mt-[-1rem]">
        {/* Back Button */}
        <button
          onClick={() => {
            onBack();
            setMood("");
          }}
          className="mb-6 inline-flex items-center gap-2 rounded-lg bg-white/30 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-white/50 transition-all"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {/* Title */}
        <div className="flex items-center justify-center mb-6">
          <Sparkles className="text-fuchsia-600 mr-2" />
          <h2 className="text-3xl font-bold text-slate-800">Mood Analysis</h2>
        </div>

        <p className="text-center text-gray-700 mb-8">
          How are you feeling today? Select your current mood to receive
          supportive color themes and personalized recommendations.
        </p>

        {/* Mood Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {moods.map((m) => (
            <button
              key={m.name}
              onClick={() => handleMood(m)}
              className={`flex flex-col items-center justify-center p-5 rounded-2xl shadow-lg bg-white hover:scale-105 transition-all ${
                mood === m.name ? "ring-2 ring-fuchsia-400" : ""
              }`}
            >
              <div className="text-2xl text-slate-700">{m.icon}</div>
              <span className="mt-2 font-semibold text-slate-800">{m.name}</span>
            </button>
          ))}
        </div>

        {/* Recommendations */}
        {mood && (
          <div className="bg-white rounded-2xl shadow p-6 border border-slate-100">
            <p className="font-medium text-gray-800 mb-2">{message}</p>
            <h3 className="font-semibold mb-3 text-sky-800">
              Your Recommendations:
            </h3>

            <ul className="space-y-3">
              {recommendations[mood].map((r, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-slate-200 p-3 hover:bg-slate-50 transition"
                >
                  <span className="text-slate-700">{r.text}</span>
                  <Link
                    to={r.link}
                    className="text-sm font-medium text-white bg-sky-600 px-3 py-1.5 rounded-lg hover:bg-sky-700 transition"
                  >
                    Go →
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
