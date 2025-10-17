import React, { useState, useEffect } from "react";
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
  const [distributionData, setDistributionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE}/activity/guidelines`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const formatted = data.map((d) => ({
          age: d.age_group,
          Sitting: d.percent_mostly_sitting,
          Standing: d.percent_mostly_standing,
          Walking: d.percent_mostly_walking,
          "Physically Demanding": d.percent_physically_demanding,
        }));

        setDistributionData(formatted);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [API_BASE]);

  const metrics = [
    { name: "Sitting", color: "#ef4444", icon: "💺", desc: "Mostly sitting during workday" },
    { name: "Standing", color: "#de16bab1", icon: "🧍‍♀️", desc: "Mostly standing during workday" },
    { name: "Walking", color: "#22c55e", icon: "🚶‍♂️", desc: "Mostly walking during workday" },
    { name: "Physically Demanding", color: "#4c89ebff", icon: "💪", desc: "Physically demanding activities" },
  ];

  const active = metrics.find((m) => m.name === activeMetric);

  if (loading) return <div>Loading sedentary data...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!distributionData.length) return <div>No data available.</div>;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-slate-800 mb-1">Sedentary Insights</h2>
        <p className="text-slate-600">
          Explore national patterns in workday activity levels.
        </p>
      </div>

      {/* Metric Cards */}
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
                  {m.icon} {m.name}
                </h3>
                <p className="text-sm text-slate-500">{m.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="rounded-3xl bg-white/70 backdrop-blur-md border border-white/40 p-6 shadow-md">
        <h3 className="text-xl font-semibold text-slate-800 mb-3">
          {active.name} Distribution
        </h3>
        <p className="text-slate-600 mb-6 leading-relaxed">
          Percentage by age group for people mostly <b>{active.name.toLowerCase()}</b> during workdays.{" "}
          {active.name === "Sitting" &&
            "Younger adults show lower sitting time compared to mid-age groups, indicating more mobility in early career years."}
          {active.name === "Standing" &&
            "Standing tends to be more common in younger workers, gradually decreasing with age as job roles shift towards desk-based work."}
          {active.name === "Walking" &&
            "Walking levels are highest among younger adults and decline steadily with age, reflecting reduced active commuting and workplace mobility."}
          {active.name === "Physically Demanding" &&
            "Physically demanding activities are concentrated among younger groups, with a sharp decline after age 35, reflecting occupational transitions."}
        </p>

        {/* Bar Chart */}
        <div className="w-full h-72">
          <ResponsiveContainer>
            <BarChart
              data={distributionData}
              margin={{ top: 10, right: 30, left: 40, bottom: 30 }} // adds space near Y-axis
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="age"
                tick={{ fill: "#475569", fontSize: 12 }}
                label={{ value: "Age Group", position: "insideBottom", offset: -10 }}
              />
              <YAxis
                tick={{ fill: "#475569", fontSize: 12 }}
                label={{
                  value: "Percentage (%)",
                  angle: -90,
                  position: "insideLeft",
                  offset: -5,
                  dy: 40, // moves label down slightly for alignment
                }}
              />
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
