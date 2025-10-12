import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Smile, Users, ArrowLeft } from "lucide-react";
import MoodAnalysis from "./MoodAnalysis";
import ConnectionScore from "./ConnectionScore";

export default function SocialWellbeing() {
  const navigate = useNavigate();
  const [view, setView] = useState("main");

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
          </button>
        </div>

        <div className="text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="rounded-2xl bg-gradient-to-r from-fuchsia-500 to-purple-600 p-4">
              <Heart className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 sm:text-4xl">
              Social Connection & Well-being
            </h1>
          </div>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            Maintain your psychological health and connect with your emotions.
          </p>
        </div>
      </div>

      {/* Main Section */}
      <div className="relative z-10 mx-auto max-w-4xl space-y-10">
        {view === "main" && (
          <div className="rounded-3xl border border-white/30 bg-white/20 p-8 shadow-xl backdrop-blur-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mood Analysis */}
              <div className="flex flex-col justify-between h-80 bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white p-6 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Smile className="text-white" />
                    <h3 className="text-xl font-semibold">Mood Analysis</h3>
                  </div>
                  <p className="text-sm opacity-90 leading-snug">
                    Identify your current mood and get personalized well-being suggestions.
                  </p>
                </div>
                <button
                  onClick={() => setView("mood")}
                  className="mt-4 inline-flex items-center justify-center rounded-lg bg-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/30 transition-all"
                >
                  Check now →
                </button>
              </div>

              {/* Connection Score Calculator */}
              <div className="flex flex-col justify-between h-80 bg-gradient-to-br from-indigo-500 to-sky-600 text-white p-6 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="text-white" />
                    <h3 className="text-xl font-semibold">Connection Score Calculator</h3>
                  </div>
                  <p className="text-sm opacity-90 leading-snug">
                    Take a quick quiz to measure your social well-being. (Coming soon)
                  </p>
                </div>
                <button
                  onClick={() => setView("connection")}
                  className="mt-4 inline-flex items-center justify-center rounded-lg bg-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/30 transition-all"
                >
                  Explore →
                </button>
              </div>
            </div>
          </div>
        )}

        {view === "mood" && <MoodAnalysis onBack={() => setView("main")} />}
        {view === "connection" && <ConnectionScore onBack={() => setView("main")} />}
      </div>
    </div>
  );
}
