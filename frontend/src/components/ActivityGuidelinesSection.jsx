import React, { useState } from "react";

export default function ActivityGuidelinesSection() {
  const metrics = [
    {
      key: "met_guidelines",
      label: "Met Guidelines",
      color: "#3b82f6",
      value: 22.8,
      desc: "Meeting all national activity guidelines.",
      distribution: [80, 70, 65, 60, 55],
    },
    {
      key: "min_150",
      label: "150+ Min/Week",
      color: "#16a34a",
      value: 74.5,
      desc: "Engaging in 150+ minutes of activity weekly.",
      distribution: [90, 85, 80, 75, 70],
    },
    {
      key: "days_5plus",
      label: "5+ Days Active",
      color: "#a855f7",
      value: 67.4,
      desc: "Active for at least 5 days each week.",
      distribution: [85, 80, 78, 70, 65],
    },
    {
      key: "strength_2days",
      label: "2+ Strength Days",
      color: "#f97316",
      value: 26.9,
      desc: "Including strength training at least 2 days a week.",
      distribution: [50, 45, 40, 38, 35],
    },
  ];

  const [index, setIndex] = useState(0);
  const metric = metrics[index];

  const next = () => setIndex((prev) => (prev + 1) % metrics.length);
  const prev = () => setIndex((prev) => (prev - 1 + metrics.length) % metrics.length);

  return (
    <div
      className="relative p-8 rounded-3xl shadow-md backdrop-blur-md border border-white/40"
      style={{
        background: `linear-gradient(135deg, ${metric.color}20, white 70%)`,
        transition: "background 0.5s ease",
      }}
    >
      {/* Slider Navigation */}
      {/* Slider Navigation */}
<div className="flex justify-between items-center mb-8">
  <button
    onClick={prev}
    className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14
      bg-white/70 hover:bg-blue-100 text-blue-600 text-2xl font-bold
      rounded-full shadow-lg transition-transform duration-300 hover:scale-110 active:scale-95"
  >
    ◀
  </button>

  <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 text-center">
    {metric.label}
  </h2>

  <button
    onClick={next}
    className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14
      bg-white/70 hover:bg-blue-100 text-blue-600 text-2xl font-bold
      rounded-full shadow-lg transition-transform duration-300 hover:scale-110 active:scale-95"
  >
    ▶
  </button>
</div>


      {/* Circular Gauge */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-40 h-40">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="10" fill="none" />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke={metric.color}
              strokeWidth="10"
              fill="none"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 - (251.2 * metric.value) / 100}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.8s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-extrabold" style={{ color: metric.color }}>
              {metric.value}%
            </span>
            <span className="text-sm text-slate-600">{metric.label}</span>
          </div>
        </div>
        <p className="text-slate-600 mt-3 text-center">{metric.desc}</p>
      </div>

      {/* Distribution */}
      <div className="bg-white/50 rounded-2xl p-6 shadow-inner">
        <h3 className="text-lg font-semibold text-slate-800 text-center mb-4">
          Distribution by Age Group
        </h3>
        <div className="space-y-4">
          {["18–24", "25–34", "35–44", "45–54", "55–64"].map((age, i) => (
            <div key={age}>
              <div className="flex justify-between text-sm text-slate-600 mb-1">
                <span>{age}</span>
                <span>{metric.distribution[i]}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${metric.distribution[i]}%`,
                    background: metric.color,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


