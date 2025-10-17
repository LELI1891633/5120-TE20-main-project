import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8163";

export default function SocialTrendsCarousel() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [data, setData] = useState({
    loneliness: [],
    volunteering: [],
    socialContact: [],
  });

  const next = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % 3);
  };
  const prev = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + 3) % 3);
  };

  // fallback data
  const fallback = {
    loneliness: [
      { year: 2018, loneliness_percent: 22.5 },
      { year: 2019, loneliness_percent: 23.1 },
      { year: 2020, loneliness_percent: 28.7 },
      { year: 2021, loneliness_percent: 26.9 },
      { year: 2022, loneliness_percent: 24.2 },
    ],
    volunteering: [
      { year: 2018, voluntary_work_through_an_organisation: 34, informal_volunteering: 48 },
      { year: 2019, voluntary_work_through_an_organisation: 33, informal_volunteering: 50 },
      { year: 2020, voluntary_work_through_an_organisation: 31, informal_volunteering: 52 },
      { year: 2021, voluntary_work_through_an_organisation: 29, informal_volunteering: 49 },
      { year: 2022, voluntary_work_through_an_organisation: 30, informal_volunteering: 51 },
    ],
    socialContact: [
      { year: 2018, "15–24": 5.4, "25–34": 5.2, "35–44": 5.0, "45–54": 4.8, "55–64": 4.5 },
      { year: 2019, "15–24": 5.5, "25–34": 5.3, "35–44": 5.1, "45–54": 4.9, "55–64": 4.6 },
      { year: 2020, "15–24": 5.7, "25–34": 5.4, "35–44": 5.2, "45–54": 4.9, "55–64": 4.7 },
      { year: 2021, "15–24": 5.8, "25–34": 5.6, "35–44": 5.3, "45–54": 5.0, "55–64": 4.8 },
      { year: 2022, "15–24": 5.6, "25–34": 5.3, "35–44": 5.1, "45–54": 4.8, "55–64": 4.5 },
    ],
  };

  useEffect(() => {
    async function fetchAll() {
      try {
        const [lonelinessRes, volunteeringRes, socialContactRes] = await Promise.allSettled([
          fetch(`${API_BASE}/loneliness-trend`).then((r) => r.json()),
          fetch(`${API_BASE}/volunteering-trend`).then((r) => r.json()),
          fetch(`${API_BASE}/social-contact-trend`).then((r) => r.json()),
        ]);

        setData({
          loneliness:
            lonelinessRes.status === "fulfilled" && lonelinessRes.value.length
              ? lonelinessRes.value
              : fallback.loneliness,
          volunteering:
            volunteeringRes.status === "fulfilled" && volunteeringRes.value.length
              ? volunteeringRes.value
              : fallback.volunteering,
          socialContact:
            socialContactRes.status === "fulfilled" && socialContactRes.value.length
              ? socialContactRes.value
              : fallback.socialContact,
        });
      } catch {
        setData(fallback);
      }
    }
    fetchAll();
  }, []);

  const trends = [
          

      {
        id: 1,
        title: "Loneliness Trends Over Time",
        desc: "Percentage of Australians reporting feelings of loneliness.",
        insight: `Loneliness has fluctuated slightly since 2010, peaking around 2020. 
        The slight decline after 2021 suggests gradual recovery in social wellbeing post-pandemic. 
        However, continued awareness and social initiatives remain essential to support vulnerable groups.`,
        color: "#ef4444",
        dataKey: "loneliness",
        chart: (chartData) => (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 60, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="year"
                stroke="#64748b"
                label={{ value: "Year", position: "insideBottom", offset: -10 }}
              />
              <YAxis
                stroke="#64748b"
                label={{ value: "Loneliness (%)", angle: -90, position: "insideLeft", offset: -5,dy: 50, }}
              />
              <Tooltip />
              <Legend verticalAlign="top" align="center" wrapperStyle={{ marginBottom: 20 }} />
              <Line
                type="monotone"
                dataKey="loneliness_percent"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ r: 4 }}
                name="Loneliness %"
              />
            </LineChart>
          </ResponsiveContainer>
        ),
      },

      {
        id: 2,
        title: "Volunteering Trends",
        desc: "Formal vs. informal volunteering participation rates.",
        insight: `Formal volunteering has steadily decreased, while informal volunteering remains relatively stable. 
        This shift highlights evolving community engagement patterns, where people increasingly help outside traditional organisations. 
        Encouraging formal participation could strengthen structured community networks.`,
        color: "#3b82f6",
        dataKey: "volunteering",
        chart: (chartData) => (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 60, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="year"
                stroke="#64748b"
                label={{ value: "Year", position: "insideBottom", offset: -10 }}
              />
              <YAxis
                stroke="#64748b"
                label={{ value: "Participation Rate (%)", angle: -90, position: "insideLeft", offset: -5 , dy: 60, }}
              />
              <Tooltip />
              <Legend verticalAlign="top" align="center" wrapperStyle={{ marginBottom: 20 }} />
              <Line
                type="monotone"
                dataKey="voluntary_work_through_an_organisation"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 4 }}
                name="Formal Volunteering"
              />
              <Line
                type="monotone"
                dataKey="informal_volunteering"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 4 }}
                name="Informal Volunteering"
              />
            </LineChart>
          </ResponsiveContainer>
        ),
      },

      {
        id: 3,
        title: "Average Social Contact Trend",
        desc: "Average number of meaningful social contacts per week, by age group.",
        insight: `Younger adults (15–24) consistently maintain the highest social contact levels. 
        Yet, every age group shows a steady decline since 2010, reflecting a broader trend of digital engagement replacing in-person interaction. 
        Promoting social initiatives can help rebuild real-world community connections.`,
        color: "#8b5cf6",
        dataKey: "socialContact",
        chart: (chartData) => (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 60, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="year"
                stroke="#64748b"
                label={{ value: "Year", position: "insideBottom", offset: -10 }}
              />
              <YAxis
                domain={[3.5, 5.8]}
                stroke="#64748b"
                label={{
                  value: "Average Contacts per Week",
                  angle: -90,
                  position: "insideLeft",
                  offset: -5,
                   dy: 70, 
                }}
              />
              <Tooltip />
              <Legend verticalAlign="top" align="center" wrapperStyle={{ marginBottom: 20 }} />
              <Line type="monotone" dataKey="15–24" stroke="#3b82f6" strokeWidth={3} dot={false} name="Age 15–24" />
              <Line type="monotone" dataKey="25–34" stroke="#10b981" strokeWidth={3} dot={false} name="Age 25–34" />
              <Line type="monotone" dataKey="35–44" stroke="#f59e0b" strokeWidth={3} dot={false} name="Age 35–44" />
              <Line type="monotone" dataKey="45–54" stroke="#ef4444" strokeWidth={3} dot={false} name="Age 45–54" />
              <Line type="monotone" dataKey="55–64" stroke="#8b5cf6" strokeWidth={3} dot={false} name="Age 55–64" />
            </LineChart>
          </ResponsiveContainer>
        ),
      },
  ];

  const current = trends[index];
  const chartData = data[current.dataKey];

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[100vh] overflow-hidden py-16">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-orange-50 to-sky-50"></div>

      {/* Navigation */}
      <div className="flex justify-between w-full max-w-5xl mb-8 px-8 z-10">
        <button
          onClick={prev}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-white/70 hover:bg-blue-100 text-blue-500 text-3xl shadow-lg hover:scale-110 active:scale-95 transition"
        >
          ◀
        </button>
        <button
          onClick={next}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-white/70 hover:bg-blue-100 text-blue-500 text-3xl shadow-lg hover:scale-110 active:scale-95 transition"
        >
          ▶
        </button>
      </div>

      {/* Chart Card */}
      <div className="relative w-full max-w-5xl h-[600px]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={current.id}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 150 : -150, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: direction > 0 ? -150 : 150, scale: 0.9 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="absolute inset-0 flex flex-col justify-center items-center text-center p-10 rounded-3xl border border-white/40 backdrop-blur-md shadow-2xl"
            style={{
              background: `linear-gradient(135deg, ${current.color}15, white 85%)`,
              boxShadow: `0 15px 45px ${current.color}40`,
            }}
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-2">
              {current.title}
            </h2>
            <p className="text-slate-600 mb-4">{current.desc}</p>

            {/* Chart */}
            <div className="w-full h-[380px] flex items-center justify-center">
              {chartData && chartData.length > 0 ? (
                current.chart(chartData)
              ) : (
                <p className="text-slate-400 italic">Loading data...</p>
              )}
            </div>

            {/* Insight paragraph */}
            <p className="mt-5 text-slate-700 text-sm max-w-3xl italic leading-relaxed">
              {current.insight}
            </p>

            <p className="text-xs text-slate-500 italic mt-4">
              Click arrows or swipe to explore other trends
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
