import React, { useState } from "react";
import ChartCard from "./Shared/ChartCard";
import InfoCard from "./Shared/InfoCard";
import Loader from "./Shared/Loader";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function EyeHealthSection() {
  const [form, setForm] = useState({
    age: "",
    gender: "Male",
    screen_time_hours: "",
    physical_activity_hours: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`${API_BASE}/eye/assess`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: Number(form.age),
          gender: form.gender,
          screen_time_hours: Number(form.screen_time_hours),
          physical_activity_hours: Number(form.physical_activity_hours),
        }),
      });

      if (!res.ok) throw new Error("Prediction failed");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError("Unable to assess risk. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ age: "", gender: "Male", screen_time_hours: "", physical_activity_hours: "" });
    setResult(null);
  };

  // ------------- Risk Gauge -------------
  const RiskGauge = ({ value }) => {
    const percent = Math.min(Math.max(value, 0), 100);
    const color =
      percent < 33
        ? "text-green-500"
        : percent < 66
        ? "text-yellow-500"
        : "text-red-500";

    return (
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
          <path
            d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="2.5"
          />
          <path
            d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke={
              percent < 33
                ? "#22c55e"
                : percent < 66
                ? "#eab308"
                : "#ef4444"
            }
            strokeWidth="2.5"
            strokeDasharray={`${percent}, 100`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`text-2xl font-bold ${color}`}>{percent.toFixed(0)}%</div>
          <div className="text-sm text-slate-600 mt-1">Risk Level</div>
        </div>
      </div>
    );
  };

  // ------------- Render -------------
  return (
    <div className="space-y-8">
      {/* Form Section */}
      <ChartCard title="Eye Health Assessment" subtitle="AI-powered visual strain analysis">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Age
            </label>
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="e.g. 30"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Gender
            </label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other/Unsp</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Screen Time (hours/day)
            </label>
            <input
              type="number"
              name="screen_time_hours"
              value={form.screen_time_hours}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="e.g. 8"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Physical Activity (hours/day)
            </label>
            <input
              type="number"
              name="physical_activity_hours"
              value={form.physical_activity_hours}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="e.g. 2"
              required
            />
          </div>

          <div className="col-span-2 flex justify-center gap-3 mt-4">
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition"
              disabled={loading}
            >
              {loading ? "Assessing..." : "Assess Eye Health"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2 rounded-lg bg-gray-100 text-slate-700 font-medium hover:bg-gray-200 transition"
            >
              Reset
            </button>
          </div>
        </form>
      </ChartCard>

      {/* Results */}
      {loading && <Loader text="Analyzing results..." />}

      {error && (
        <div className="text-center text-red-600 font-medium">{error}</div>
      )}

      {result && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            <RiskGauge
              value={
                result.probabilities
                  ? Math.max(
                      ...Object.values(result.probabilities).map((v) => v * 100)
                    )
                  : 0
              }
            />
            <div>
              <InfoCard
                title="Predicted Category"
                value={result.predicted_class}
                color="blue"
                description={result.message}
              />
            </div>
          </div>

          {/* Probability bars */}
          <ChartCard title="Class Probabilities">
            <div className="flex flex-col gap-3 w-full max-w-md mx-auto">
              {Object.entries(result.probabilities).map(([cls, prob]) => (
                <div key={cls} className="flex flex-col">
                  <div className="flex justify-between text-sm text-slate-700 mb-1">
                    <span>{cls}</span>
                    <span>{(prob * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-3 rounded-full ${
                        prob < 0.33
                          ? "bg-green-400"
                          : prob < 0.66
                          ? "bg-yellow-400"
                          : "bg-red-400"
                      }`}
                      style={{ width: `${prob * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      )}
    </div>
  );
}
