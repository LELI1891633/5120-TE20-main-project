import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Download, CalendarDays, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";

const pad = (n) => String(n).padStart(2, "0");
const ymd = (y, m0, d) => `${y}-${pad(m0 + 1)}-${pad(d)}`;
const monthName = (y, m0) => new Date(y, m0, 1).toLocaleString(undefined, { month: "long", year: "numeric" });
const daysInMonth = (y, m0) => new Date(y, m0 + 1, 0).getDate();
const firstDayIndexSun0 = (y, m0) => new Date(y, m0, 1).getDay();

export default function MonthlyWellbeing() {
  const navigate = useNavigate();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month0, setMonth0] = useState(now.getMonth());
  const [wellbeing, setWellbeing] = useState({});

  const dim = daysInMonth(year, month0);
  const first = firstDayIndexSun0(year, month0);
  const cells = useMemo(() => {
    const pre = Array(first).fill(null);
    const days = Array.from({ length: dim }, (_, i) => i + 1);
    const out = pre.concat(days);
    while (out.length % 7 !== 0) out.push(null);
    return out;
  }, [first, dim]);

  const toggleWellbeing = (key, field) => {
    setWellbeing((prev) => {
      const next = { ...prev };
      const cur = next[key] || {};
      next[key] = { ...cur, [field]: !cur[field] };
      return next;
    });
  };

  const go = (delta) => {
    const dt = new Date(year, month0, 1);
    dt.setMonth(dt.getMonth() + delta);
    setYear(dt.getFullYear());
    setMonth0(dt.getMonth());
  };

  const handlePrint = () => window.print();

  useEffect(() => {
    console.assert(cells.length % 7 === 0, "[MonthlyWellbeing] grid must be multiple of 7");
  }, [cells.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-sky-50">
      <div className="mx-auto max-w-6xl p-6">
        {/* Header (hidden on print) */}
        <div className="mb-4 no-print flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Left: back + title */}
          <div className="flex items-start sm:items-center gap-3">
            <button
              onClick={() => navigate("/planner")}
              className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/20 px-4 py-2 font-medium text-slate-700 shadow-sm backdrop-blur-md transition-all duration-200 hover:bg-white/30 hover:shadow-md"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-800">Monthly – Calendar + Wellbeing</h1>
              <p className="text-xs sm:text-sm text-slate-600">Tap the chips in each day to log exercise 🏃 and mindfulness 🧘.</p>
            </div>
          </div>
          {/* Right: controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <button className="rounded-2xl border border-slate-200 bg-white text-slate-700 px-3 py-2 text-sm" onClick={() => go(-1)}>
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="px-3 py-2 text-slate-800 font-medium rounded-2xl bg-white border border-slate-200 min-w-[160px] text-center text-sm sm:text-base">
              {monthName(year, month0)}
            </div>
            <button className="rounded-2xl border border-slate-200 bg-white text-slate-700 px-3 py-2 text-sm" onClick={() => go(1)}>
              <ChevronRight className="h-4 w-4" />
            </button>
            <button onClick={handlePrint} className="sm:ml-2 rounded-2xl shadow bg-sky-600 hover:bg-sky-700 text-white px-3 sm:px-4 py-2 flex items-center gap-2 text-sm">
              <Download className="h-4 w-4" /> Download / Print
            </button>
          </div>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 text-slate-700 font-medium">
                <CalendarDays className="h-4 w-4" /> Month
              </div>
              <div className="p-4">
                <div className="grid grid-cols-7 gap-2 text-[11px] sm:text-xs font-medium text-slate-700 mb-2">
                  {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
                    <div key={d} className="text-center">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                  {cells.map((num, i) => {
                    const key = num ? ymd(year, month0, num) : `b-${i}`;
                    const ex = !!wellbeing[key]?.ex;
                    const mi = !!wellbeing[key]?.mi;
                    return (
                      <div key={key} className={`wb-cell rounded-xl border ${num ? "border-slate-200 bg-white" : "border-transparent bg-transparent"} p-2 min-h-[84px] sm:min-h-[94px] overflow-hidden`}>
                        {num && (
                          <>
                            <div className="text-[11px] text-slate-800 font-medium">{num}</div>
                            <div className="mt-2 flex flex-wrap gap-1 wb-chip-wrap max-w-full">
                              <button type="button" title="Exercise" aria-pressed={ex} className={`h-6 w-6 sm:h-7 sm:w-7 text-[10px] sm:text-xs inline-flex items-center justify-center rounded-full border transition-colors wb-chip ${ex? 'bg-sky-600 text-white border-sky-600':'bg-white text-sky-700 border-sky-200 hover:bg-sky-50'}`} onClick={() => toggleWellbeing(key, 'ex')}>🏃</button>
                              <button type="button" title="Mindfulness" aria-pressed={mi} className={`h-6 w-6 sm:h-7 sm:w-7 text-[10px] sm:text-xs inline-flex items-center justify-center rounded-full border transition-colors wb-chip ${mi? 'bg-sky-600 text-white border-sky-600':'bg-white text-sky-700 border-sky-200 hover:bg-sky-50'}`} onClick={() => toggleWellbeing(key, 'mi')}>🧘</button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Summary card */}
          <MonthSummary year={year} month0={month0} state={wellbeing} />
        </div>
        {/* Print styles */}
        <style>{`
          @media print {
            /* Hide page header and any site/global footers during print */
            .no-print, footer, .site-footer, .app-footer { display: none !important; }
            /* Reduce wellbeing chips size on print to avoid overflow */
            .wb-chip { height: 20px !important; width: 20px !important; font-size: 10px !important; }
            .wb-chip-wrap { gap: 2px !important; }
            /* Ensure chips do not overflow cell */
            .wb-cell { overflow: hidden !important; }
          }
        `}</style>
      </div>
    </div>
  );
}

function MonthSummary({ year, month0, state }) {
  const weeks = useMemo(() => {
    const result = Array.from({ length: 6 }, () => ({ ex: 0, mi: 0, days: 0 }));
    const dim = daysInMonth(year, month0);
    const first = firstDayIndexSun0(year, month0);
    for (let d = 1; d <= dim; d++) {
      const idx = Math.floor((first + (d - 1)) / 7);
      result[idx].days++;
      const key = ymd(year, month0, d);
      if (state[key]?.ex) result[idx].ex++;
      if (state[key]?.mi) result[idx].mi++;
    }
    return result;
  }, [year, month0, state]);

  const totalEx = weeks.reduce((a, w) => a + w.ex, 0);
  const totalMi = weeks.reduce((a, w) => a + w.mi, 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <div className="px-4 py-3 border-b border-slate-100 text-slate-700 font-medium">💙 Wellbeing (Month)</div>
      <div className="p-4 space-y-3">
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200">🏃 Exercise: <b>{totalEx}</b></span>
          <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200">🧘 Mindfulness: <b>{totalMi}</b></span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {weeks.map((w, i) => {
            const exPct = w.days ? Math.round((w.ex / w.days) * 100) : 0;
            const miPct = w.days ? Math.round((w.mi / w.days) * 100) : 0;
            return (
              <div key={i} className="rounded-xl border border-slate-200 p-3">
                <div className="text-xs font-medium text-slate-800">Week {i + 1}</div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-700">
                  <div>
                    <div className="mb-1">🏃 {exPct}%</div>
                    <div className="h-2 rounded bg-slate-100">
                      <div className="h-2 rounded bg-sky-600" style={{ width: `${exPct}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="mb-1">🧘 {miPct}%</div>
                    <div className="h-2 rounded bg-slate-100">
                      <div className="h-2 rounded bg-sky-600" style={{ width: `${miPct}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-[11px] text-slate-600">Tip: 10‑min walk or 3‑min breathing still counts. Consistency > volume.</p>
      </div>
    </div>
  );
}



