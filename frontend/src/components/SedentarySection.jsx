import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SedentarySection() {
  const [activeMetric, setActiveMetric] = useState("Sitting");

  const metrics = [
    { name: "Sitting", value: 45.2, color: "#ef4444",icon: "💺", desc: "Mostly sitting during workday" },
    { name: "Standing", value: 19.4, color: "#de16bab1", icon: "🧍‍♀️", desc: "Mostly standing during workday" },
    { name: "Walking", value: 21.4, color: "#22c55e", icon: "🚶‍♂️", desc: "Mostly walking during workday" },
    { name: "Physically Demanding", value: 13.7, color: "#4c89ebff",icon: "💪", desc: "Physically demanding activities" },
  ];

  const distributionData = [
    { age: "18–24", Sitting: 22.8, Standing: 18.5, Walking: 19.2, "Physically Demanding": 12.5 },
    { age: "25–34", Sitting: 45.5, Standing: 20.2, Walking: 25.6, "Physically Demanding": 15.8 },
    { age: "35–44", Sitting: 54.4, Standing: 23.0, Walking: 20.4, "Physically Demanding": 13.0 },
    { age: "45–54", Sitting: 52.9, Standing: 19.1, Walking: 18.7, "Physically Demanding": 14.1 },
    { age: "55–64", Sitting: 50.6, Standing: 16.9, Walking: 16.4, "Physically Demanding": 11.5 },
  ];

  const active = metrics.find((m) => m.name === activeMetric);

  return (
    <div className="flex flex-col gap-8">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-slate-800 mb-1">
          Sedentary Insights
        </h2>
        <p className="text-slate-600">
          Explore national patterns in workday activity levels.
        </p>
      </div>

      {/* Scrollable Metric Cards */}
      <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide">
        {metrics.map((m) => (
          <div
            key={m.name}
            onClick={() => setActiveMetric(m.name)}
            className={`min-w-[200px] flex-shrink-0 cursor-pointer rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:shadow-md ${
              activeMetric === m.name
                ? "bg-gradient-to-br from-white via-sky-50 to-blue-50 border-blue-300 scale-[1.05]"
                : "bg-white/60 hover:bg-white/80 border-white/40"
            }`}
          >
            <div className="flex flex-col h-full justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  {m.name}
                </h3>
                <p className="text-sm text-slate-500">{m.desc}</p>
              </div>
              <p
                className="text-3xl font-bold mt-4"
                style={{ color: m.color }}
              >
                {m.value}%
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Active Metric Summary */}
      <div className="rounded-3xl bg-white/60 backdrop-blur-md border border-white/40 p-6 shadow-md">
        <h3 className="text-xl font-semibold text-slate-800 mb-3">
          {active.name} Distribution
        </h3>
        <p className="text-slate-600 mb-6">
          Percentage by age group for people mostly <b>{active.name.toLowerCase()}</b> during workdays.
        </p>

        {/* Modern Bar Chart instead of Pie */}
        <div className="w-full h-72">
          <ResponsiveContainer>
            <BarChart
              data={distributionData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="age" tick={{ fill: "#475569", fontSize: 12 }} />
              <YAxis tick={{ fill: "#475569", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                }}
              />
              <Bar
                dataKey={active.name}
                fill={active.color}
                radius={[8, 8, 0, 0]}
                barSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

