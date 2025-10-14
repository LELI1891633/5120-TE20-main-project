import React, { useState, useEffect } from "react";

export default function ActivityGuidelinesSection() {
  const [data, setData] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE}/guidelines`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [API_BASE]);

  if (loading) return <div>Loading guidelines data...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!data.length) return <div>No data available.</div>;

  const metrics = [
    {
      key: "percent_met_guidelines",
      label: "Met Guidelines",
      color: "#3b82f6",
      desc: "Meeting all national activity guidelines.",
      distribution: data.map((d) => d.percent_met_guidelines),
    },
    {
      key: "percent_150min_or_more",
      label: "150+ Min/Week",
      color: "#16a34a",
      desc: "Engaging in 150+ minutes of activity weekly.",
      distribution: data.map((d) => d.percent_150min_or_more),
    },
    {
      key: "percent_five_or_more_days_active",
      label: "5+ Days Active",
      color: "#a855f7",
      desc: "Active for at least 5 days each week.",
      distribution: data.map((d) => d.percent_five_or_more_days_active),
    },
    {
      key: "percent_strength_toning_two_days",
      label: "2+ Strength Days",
      color: "#f97316",
      desc: "Including strength training at least 2 days a week.",
      distribution: data.map((d) => d.percent_strength_toning_two_days),
    },
  ];

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
      {/* Navigation */}
      <div className="flex justify-between items-center mb-6">
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

      {/* Description only (Gauge removed) */}
      <p className="text-slate-600 mb-8 text-center">{metric.desc}</p>

      {/* Distribution by Age Group */}
      <div className="bg-white/50 rounded-2xl p-6 shadow-inner">
        <h3 className="text-lg font-semibold text-slate-800 text-center mb-4">
          Distribution by Age Group
        </h3>
        <div className="space-y-4">
          {data.map((d, i) => (
            <div key={d.age_group}>
              <div className="flex justify-between text-sm text-slate-600 mb-1">
                <span>{d.age_group}</span>
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
