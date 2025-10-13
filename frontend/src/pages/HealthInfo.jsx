import React, { useState } from "react";
import { ArrowLeft, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Import feature sections
import SedentarySection from "../components/SedentarySection";
import ActivityGuidelinesSection from "../components/ActivityGuidelinesSection";
import SocialConnectionInsights from "../components/SocialConnectionInsights";
import ResourcesSection from "../components/ResourcesSection";

export default function HealthInfo() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sedentary");

  const sections = [
    {
      id: "sedentary",
      icon: "💺",
      title: "Sedentary",
      desc: "Understand your daily sitting and activity balance.",
      gradient: "from-orange-200/60 to-pink-200/60",
    },
    {
      id: "activity",
      icon: "🏃‍♀️",
      title: "Physical Activity",
      desc: "Track your alignment with national movement guidelines.",
      gradient: "from-green-200/60 to-emerald-200/60",
    },
    {
      id: "social",
      icon: "🤝",
      title: "Average Social Contact Trend",
      desc: "National average social contact through out the years.",
      gradient: "from-sky-200/60 to-purple-200/60",
    },
    {
      id: "resources",
      icon: "📚",
      title: "Resources",
      desc: "Access trusted workplace and health safety links.",
      gradient: "from-blue-200/60 to-indigo-200/60",
    },
  ];

  return (
    <div className="relative min-h-screen p-6 sm:p-10 bg-gradient-to-br from-orange-50 via-pink-50 to-sky-50 overflow-hidden">
      {/* Floating pastel glows */}
      <div className="absolute inset-0 overflow-hidden opacity-40">
        <div className="absolute -top-16 -left-20 w-96 h-96 bg-gradient-to-br from-orange-200/40 to-pink-200/40 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tr from-sky-200/40 to-purple-200/40 rounded-full blur-3xl animate-pulse-slower"></div>
      </div>

      {/* Main container */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Navigation */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 bg-white/30 backdrop-blur-md hover:bg-white/50 text-slate-700 font-medium px-4 py-2 rounded-lg border border-white/40 shadow-sm hover:shadow-md transition-all"
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>

          <button
            onClick={() => navigate("/stress-buster")}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-400/40 to-purple-400/40 hover:from-pink-400/60 hover:to-purple-400/60 text-slate-800 font-medium px-4 py-2 rounded-lg border border-pink-300/50 shadow-sm hover:shadow-md transition-all"
          >
            <Heart size={16} />
            Go to Stress Buster
          </button>
        </div>

        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-8 text-center">
          Health & Wellbeing Insights
        </h1>

        {/* Section Selector Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
          {sections.map((card) => (
            <button
              key={card.id}
              onClick={() => setActiveTab(card.id)}
              className={`relative flex flex-col items-start p-5 rounded-2xl text-left transition-all duration-300 border backdrop-blur-md shadow-sm hover:shadow-xl hover:scale-[1.03] ${
                activeTab === card.id
                  ? `bg-gradient-to-br ${card.gradient} border-blue-400/40 shadow-lg`
                  : `bg-gradient-to-br ${card.gradient} border-white/30 hover:border-blue-200/40`
              }`}
            >
              <div className="text-3xl mb-3">{card.icon}</div>
              <h3 className="text-lg font-semibold text-slate-800">
                {card.title}
              </h3>
              <p className="text-sm text-slate-600 leading-snug">
                {card.desc}
              </p>
              {activeTab === card.id && (
                <div className="absolute right-3 top-3 bg-blue-500/80 text-white text-xs px-2 py-1 rounded-md shadow-sm">
                  Active
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Section Content */}
        <div className="bg-white/40 backdrop-blur-md rounded-2xl border border-white/30 p-6 shadow-lg transition-all duration-300">
          {activeTab === "sedentary" && <SedentarySection />}
          {activeTab === "activity" && <ActivityGuidelinesSection />}
          {activeTab === "social" && <SocialConnectionInsights />}
          {activeTab === "resources" && <ResourcesSection />}
        </div>
      </div>

      {/* Soft pulsing animation */}
      <style>
        {`
          @keyframes pulse-slow {
            0%, 100% { opacity: 0.5; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.05); }
          }
          .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
          .animate-pulse-slower { animation: pulse-slow 10s ease-in-out infinite; }
        `}
      </style>
    </div>
  );
}
