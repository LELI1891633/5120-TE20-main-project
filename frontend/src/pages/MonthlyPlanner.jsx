import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Flag,
  Download,
  Star,
  Check,
  Clock3,
  Filter,
  Link as LinkIcon,
  HeartPulse,
  ArrowLeft
} from "lucide-react";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const CATEGORIES = [
  { key: "project", label: "Project", color: "#2563eb" },
  { key: "finance", label: "Finance", color: "#16a34a" },
  { key: "ops", label: "Ops", color: "#f59e0b" },
  { key: "hr", label: "HR", color: "#ef4444" },
  { key: "other", label: "Other", color: "#6b7280" },
];
const PRIORITIES = ["P1", "P2", "P3"];
const STATUSES = ["Planned", "In Progress", "Blocked", "Done"];

const PRIORITY_STYLES = {
  P1: { color: "#1d4ed8" },
  P2: { color: "#0891b2" },
  P3: { color: "#64748b" },
};
const priColor = (p) => PRIORITY_STYLES[p]?.color || "#64748b";

function firstOfMonth(d) { const x = new Date(d); x.setDate(1); x.setHours(0,0,0,0); return x; }
function daysInMonth(d) { return new Date(d.getFullYear(), d.getMonth()+1, 0).getDate(); }
function monthName(d) { return d.toLocaleString(undefined, { month: "long", year: "numeric" }); }
function addMonths(d, delta) { const x = new Date(d); x.setMonth(x.getMonth()+delta); return x; }
function localIso(d) { const y=d.getFullYear(); const m=String(d.getMonth()+1).padStart(2,"0"); const day=String(d.getDate()).padStart(2,"0"); return `${y}-${m}-${day}`; }
function daysBetween(a,b){const A=new Date(a+"T00:00:00");const B=new Date(b+"T00:00:00");return Math.round((B-A)/86400000);}

const defaultWellbeingGoals = [
  { id: "exercise", name: "Exercise", monthlyTarget: 12, color: "#0ea5e9" },
  { id: "mindfulness", name: "Mindfulness", monthlyTarget: 16, color: "#22c55e" },
  { id: "sleep", name: "Sleep Early", monthlyTarget: 20, color: "#a78bfa" },
];

const MonthlyPlanner = () => {
  const navigate = useNavigate();
  const [viewDate, setViewDate] = useState(() => firstOfMonth(new Date()));
  const [deadlines, setDeadlines] = useState([]);

  // Filters
  const [q, setQ] = useState("");
  const [fCategory, setFCategory] = useState("all");
  const [fPriority, setFPriority] = useState("all");
  const [fStatus, setFStatus] = useState("all");

  // Form state
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(() => localIso(new Date()));
  const [category, setCategory] = useState("project");
  const [priority, setPriority] = useState("P2");
  const [status, setStatus] = useState("Planned");
  const [owner, setOwner] = useState("");
  const [link, setLink] = useState("");

  // Wellbeing goals
  const [wellbeingGoals, setWellbeingGoals] = useState(defaultWellbeingGoals);
  const [wellbeingProgress, setWellbeingProgress] = useState(() => {
    const seed = {};
    for (const g of defaultWellbeingGoals) seed[g.id] = 0;
    return seed;
  });

  const todayISO = localIso(new Date());

  const grid = useMemo(() => {
    const first = firstOfMonth(viewDate);
    const startDay = first.getDay();
    const dim = daysInMonth(viewDate);
    const cells = [];
    for (let i=0;i<startDay;i++) cells.push({ day:null });
    for (let d=1; d<=dim; d++) {
      const iso = localIso(new Date(viewDate.getFullYear(), viewDate.getMonth(), d));
      cells.push({ day:d, iso });
    }
    while (cells.length < 42) cells.push({ day:null });
    return cells;
  }, [viewDate]);

  const deadlinesByISO = useMemo(() => {
    const map = new Map();
    for (const dl of deadlines) {
      const arr = map.get(dl.date) || [];
      arr.push(dl);
      map.set(dl.date, arr);
    }
    return map;
  }, [deadlines]);

  function addDeadline(){ if(!title.trim()||!date) return; setDeadlines(ds=>[...ds,{ id:Math.random().toString(36).slice(2), title:title.trim(), date, category, priority, status, owner: owner.trim()||undefined, link: link.trim()||undefined, starred:false }]); setTitle(""); setOwner(""); setLink(""); setPriority("P2"); setStatus("Planned"); setCategory("project"); }
  function toggleStar(id){ setDeadlines(ds=>ds.map(d=>d.id===id?{...d, starred:!d.starred}:d)); }
  function updateStatus(id,s){ setDeadlines(ds=>ds.map(d=>d.id===id?{...d,status:s}:d)); }
  function snooze(id,days){ setDeadlines(ds=>ds.map(d=>d.id===id?{...d,date:localIso(new Date(new Date(d.date+"T00:00:00").getTime()+days*86400000))}:d)); }
  function removeDeadline(id){ setDeadlines(ds=>ds.filter(d=>d.id!==id)); }

  const filtered = useMemo(()=>{
    return deadlines
      .filter(d=>{
        const byQ = q.trim() ? (d.title.toLowerCase().includes(q.toLowerCase()) || d.owner?.toLowerCase().includes(q.toLowerCase())) : true;
        const byC = fCategory === "all" ? true : d.category === fCategory;
        const byP = fPriority === "all" ? true : d.priority === fPriority;
        const byS = fStatus === "all" ? true : d.status === fStatus;
        return byQ && byC && byP && byS;
      })
      .sort((a,b)=>a.date.localeCompare(b.date));
  }, [deadlines,q,fCategory,fPriority,fStatus]);

  const groups = useMemo(()=>{
    const today = todayISO;
    const s = { overdue:[], week:[], later:[] };
    for(const d of filtered){
      if(d.date < today && d.status !== "Done") s.overdue.push(d);
      else if(daysBetween(today,d.date) <= 7) s.week.push(d);
      else s.later.push(d);
    }
    return s;
  }, [filtered, todayISO]);

  function handleDownload(){ window.print(); }
  function catColor(key){ return CATEGORIES.find(c=>c.key===key)?.color || "#6b7280"; }

  function incWellbeing(id, delta){
    setWellbeingProgress(p=>({ ...p, [id]: Math.max(0, (p[id]||0) + delta) }));
  }

  useEffect(()=>{
    if(typeof document === "undefined") return;
    const containsText = (t)=>Array.from(document.querySelectorAll("*")).some(el=>el.textContent?.includes(t));
    console.assert(containsText("Monthly Planner"), "[MonthlyPlanner] Missing title");
    console.assert(containsText("Month"), "[MonthlyPlanner] Missing calendar heading");
    console.assert(containsText("Overdue"), "[MonthlyPlanner] Missing Overdue list");
    console.assert(containsText("Due in 7 days"), "[MonthlyPlanner] Missing Due in 7 days list");
    console.assert(containsText("Wellbeing Goals"), "[MonthlyPlanner] Missing Wellbeing section");
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-sky-50 py-6 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute top-0 right-1/3 h-80 w-80 rounded-full bg-gradient-to-br from-orange-200/40 to-pink-200/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-gradient-to-br from-sky-200/40 to-pink-200/40 blur-3xl" />
      </div>
      
      <div className="relative z-10 mx-auto max-w-7xl print-mono">
        <div className="mb-6 text-center no-print">
          <div className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 to-violet-600 p-3 text-white">
            <CalendarDays size={20} />
            <span className="font-semibold">Monthly Planner</span>
          </div>
        </div>

        {/* Header controls */}
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3 no-print">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/planner')}
              className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/20 px-4 py-2 font-medium text-slate-700 shadow-sm backdrop-blur-md transition-all duration-200 hover:bg-white/30 hover:shadow-md"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <button
              className="rounded-lg bg-white/80 text-sky-700 border border-white/40 hover:bg-white px-3 py-2"
              onClick={()=>setViewDate(d=>addMonths(d,-1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="px-3 py-2 text-slate-800 font-medium rounded-lg bg-white/80 border border-white/40">
              {monthName(viewDate)}
            </div>
          <button
              className="rounded-lg bg-white/80 text-sky-700 border border-white/40 hover:bg-white px-3 py-2"
              onClick={()=>setViewDate(d=>addMonths(d,1))}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <button onClick={handleDownload} className="rounded-lg bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 shadow">
            <Download className="inline-block mr-2 h-4 w-4" /> Download / Print
          </button>
        </div>

        {/* Calendar */}
        <div className="rounded-2xl border border-white/30 bg-white/20 shadow-xl backdrop-blur-md mb-4">
          <div className="p-4">
            <div className="flex items-center gap-2 text-slate-700 mb-2">
              <CalendarDays className="h-5 w-5" /> Month
            </div>
            <div className="grid grid-cols-7 text-center text-xs font-medium text-slate-600 mb-2">
              {WEEKDAYS.map((w)=> (<div key={w} className="py-1">{w}</div>))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {grid.map((cell, idx)=> (
                <div key={idx} className={`min-h-[92px] rounded-xl border ${cell.day? "bg-white border-slate-200" : "bg-slate-100/40 border-transparent"} p-2 flex flex-col`}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{cell.day || ""}</span>
                    {cell.iso && deadlinesByISO.get(cell.iso)?.length ? (
                      <span className="text-[10px] text-slate-700">{deadlinesByISO.get(cell.iso).length} due</span>
                    ) : null}
                  </div>
                  <div className="mt-1 space-y-1">
                    {cell.iso && (deadlinesByISO.get(cell.iso) || []).slice(0,3).map((d)=> (
                      <div key={d.id} className="truncate rounded-md px-2 py-1 flex items-center gap-1 text-[11px]"
                        style={{ backgroundColor: `${priColor(d.priority)}15`, border: `1px solid ${priColor(d.priority)}30`, color: priColor(d.priority), boxShadow: `inset 3px 0 0 ${catColor(d.category)}` }}>
                        <Flag className="h-3 w-3" /> {d.title}
                        <span className="ml-auto text-[10px] font-semibold rounded-full px-1.5 py-0.5" style={{ backgroundColor: `${priColor(d.priority)}15`, border: `1px solid ${priColor(d.priority)}30`, color: priColor(d.priority) }}>{d.priority}</span>
                        {d.status === "Done" && <Check className="ml-auto h-3 w-3" />}
                      </div>
                    ))}
                    {cell.iso && (deadlinesByISO.get(cell.iso)?.length || 0) > 3 && (
                      <div className="text-[10px] text-slate-700">+ more…</div>
                    )}
                  </div>
              </div>
              ))}
            </div>
          </div>
        </div>

        {/* Controls + Add form */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Filters */}
          <div className="rounded-2xl border border-white/30 bg-white/20 shadow-xl backdrop-blur-md lg:col-span-2">
            <div className="p-4">
              <div className="flex items-center gap-2 text-slate-700 mb-3"><Filter className="h-5 w-5" /> Filters</div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input placeholder="Search title or owner…" value={q} onChange={(e)=>setQ(e.target.value)} className="rounded-lg border-slate-300 px-3 py-2" />
                <select value={fCategory} onChange={(e)=>setFCategory(e.target.value)} className="rounded-lg border-slate-300 px-3 py-2">
                  <option value="all">All categories</option>
                  {CATEGORIES.map(c=> (<option key={c.key} value={c.key}>{c.label}</option>))}
                </select>
                <select value={fPriority} onChange={(e)=>setFPriority(e.target.value)} className="rounded-lg border-slate-300 px-3 py-2">
                  <option value="all">All priorities</option>
                  {PRIORITIES.map(p=> (<option key={p} value={p}>{p}</option>))}
                </select>
                <select value={fStatus} onChange={(e)=>setFStatus(e.target.value)} className="rounded-lg border-slate-300 px-3 py-2">
                  <option value="all">All status</option>
                  {STATUSES.map(s=> (<option key={s} value={s}>{s}</option>))}
                </select>
              </div>
              </div>
            </div>

          {/* Add deadline */}
          <div className="rounded-2xl border border-white/30 bg-white/20 shadow-xl backdrop-blur-md">
            <div className="p-4">
              <div className="flex items-center gap-2 text-slate-700 mb-3"><Flag className="h-5 w-5" /> Add deadline</div>
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} className="col-span-2 rounded-lg border-slate-300 px-3 py-2" />
                <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="rounded-lg border-slate-300 px-3 py-2" />
                <select value={category} onChange={(e)=>setCategory(e.target.value)} className="rounded-lg border-slate-300 px-3 py-2">
                  {CATEGORIES.map(c=> (<option key={c.key} value={c.key}>{c.label}</option>))}
                </select>
                <select value={priority} onChange={(e)=>setPriority(e.target.value)} className="rounded-lg border-slate-300 px-3 py-2">
                  {PRIORITIES.map(p=> (<option key={p} value={p}>{p}</option>))}
                </select>
                <select value={status} onChange={(e)=>setStatus(e.target.value)} className="rounded-lg border-slate-300 px-3 py-2">
                  {STATUSES.map(s=> (<option key={s} value={s}>{s}</option>))}
                </select>
                <input placeholder="Owner (optional)" value={owner} onChange={(e)=>setOwner(e.target.value)} className="rounded-lg border-slate-300 px-3 py-2" />
                <div className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4 text-slate-700" />
                  <input placeholder="Link (optional)" value={link} onChange={(e)=>setLink(e.target.value)} className="rounded-lg border-slate-300 px-3 py-2 w-full" />
                  </div>
                <div className="col-span-2 flex justify-end mt-1">
                  <button onClick={addDeadline} className="rounded-lg bg-purple-600 hover:bg-purple-700 text-white px-4 py-2">Add</button>
                </div>
              </div>
                </div>
              </div>
            </div>

        {/* Lists + Wellbeing */}
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Overdue */}
          <div className="rounded-2xl border border-white/30 bg-white/20 shadow-xl backdrop-blur-md">
            <div className="p-4">
              <div className="text-slate-700 font-semibold mb-2">Overdue</div>
              {groups.overdue.length === 0 && (<p className="text-sm text-slate-600">None — great job 👏</p>)}
              <ul className="space-y-2">
                {groups.overdue.map(d=> (
                  <li key={d.id} className="rounded-xl border border-slate-200 p-2">
                    <div className="flex items-center gap-2 text-sm">
                      <button onClick={()=>toggleStar(d.id)} title="Star" className={`h-6 w-6 rounded-full border ${d.starred? "bg-yellow-400/90 text-white border-yellow-400":"bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`}>
                        <Star className="h-3 w-3" />
                      </button>
                      <span className="font-medium text-slate-800">{d.title}</span>
                      <span className="ml-auto text-slate-600">D+{Math.abs(daysBetween(d.date, todayISO))}</span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="rounded-full px-2 py-0.5" style={{ backgroundColor:`${priColor(d.priority)}15`, border:`1px solid ${priColor(d.priority)}30`, color:priColor(d.priority), boxShadow:`inset 3px 0 0 ${catColor(d.category)}` }}>{CATEGORIES.find(c=>c.key===d.category)?.label}</span>
                      <span className="rounded-full px-2 py-0.5" style={{ backgroundColor:`${priColor(d.priority)}15`, border:`1px solid ${priColor(d.priority)}30`, color:priColor(d.priority) }}>{d.priority}</span>
                      <span className="rounded-full border border-slate-200 px-2 py-0.5">{d.status}</span>
                      {d.owner && <span className="rounded-full border border-slate-200 px-2 py-0.5">@{d.owner}</span>}
                      {d.link && (<a className="rounded-full border border-slate-200 px-2 py-0.5" href={d.link} target="_blank" rel="noreferrer">Link</a>)}
                      <div className="ml-auto flex gap-1">
                        <button className="h-7 rounded-lg bg-white text-slate-700 border border-slate-200 px-2 hover:bg-slate-50" onClick={()=>updateStatus(d.id, "Done")}><Check className="h-3 w-3 mr-1 inline"/>Done</button>
                        <button className="h-7 rounded-lg bg-white text-slate-700 border border-slate-200 px-2 hover:bg-slate-50" onClick={()=>snooze(d.id,1)}><Clock3 className="h-3 w-3 mr-1 inline"/>+1d</button>
                        <button className="h-7 rounded-lg bg-white text-slate-700 border border-slate-200 px-2 hover:bg-slate-50" onClick={()=>snooze(d.id,7)}><Clock3 className="h-3 w-3 mr-1 inline"/>+1w</button>
                        <button className="h-7 rounded-lg text-slate-700 px-2 hover:bg-slate-50" onClick={()=>removeDeadline(d.id)}>Remove</button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              </div>
            </div>

          {/* Week */}
          <div className="rounded-2xl border border-white/30 bg-white/20 shadow-xl backdrop-blur-md">
            <div className="p-4">
              <div className="text-slate-700 font-semibold mb-2">Due in 7 days</div>
              {groups.week.length === 0 && (<p className="text-sm text-slate-600">Nothing due in the next week.</p>)}
              <ul className="space-y-2">
                {groups.week.map(d=> (
                  <li key={d.id} className="rounded-xl border border-slate-200 p-2">
                    <div className="flex items-center gap-2 text-sm">
                      <button onClick={()=>toggleStar(d.id)} title="Star" className={`h-6 w-6 rounded-full border ${d.starred? "bg-yellow-400/90 text-white border-yellow-400":"bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`}>
                        <Star className="h-3 w-3" />
                      </button>
                      <span className="font-medium text-slate-800">{d.title}</span>
                      <span className="ml-auto text-slate-600">D‑{daysBetween(todayISO, d.date)}</span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="rounded-full px-2 py-0.5" style={{ backgroundColor:`${priColor(d.priority)}15`, border:`1px solid ${priColor(d.priority)}30`, color:priColor(d.priority), boxShadow:`inset 3px 0 0 ${catColor(d.category)}` }}>{CATEGORIES.find(c=>c.key===d.category)?.label}</span>
                      <span className="rounded-full px-2 py-0.5" style={{ backgroundColor:`${priColor(d.priority)}15`, border:`1px solid ${priColor(d.priority)}30`, color:priColor(d.priority) }}>{d.priority}</span>
                      <span className="rounded-full border border-slate-200 px-2 py-0.5">{d.status}</span>
                      {d.owner && <span className="rounded-full border border-slate-200 px-2 py-0.5">@{d.owner}</span>}
                      {d.link && (<a className="rounded-full border border-slate-200 px-2 py-0.5" href={d.link} target="_blank" rel="noreferrer">Link</a>)}
                      <div className="ml-auto flex gap-1">
                        <button className="h-7 rounded-lg bg-white text-slate-700 border border-slate-200 px-2 hover:bg-slate-50" onClick={()=>updateStatus(d.id, "In Progress")}>In Progress</button>
                        <button className="h-7 rounded-lg bg-white text-slate-700 border border-slate-200 px-2 hover:bg-slate-50" onClick={()=>updateStatus(d.id, "Blocked")}>Blocked</button>
                        <button className="h-7 rounded-lg bg-white text-slate-700 border border-slate-200 px-2 hover:bg-slate-50" onClick={()=>updateStatus(d.id, "Done")}><Check className="h-3 w-3 mr-1 inline"/>Done</button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Wellbeing Goals */}
          <div className="rounded-2xl border border-white/30 bg-white/20 shadow-xl backdrop-blur-md">
            <div className="p-4">
              <div className="flex items-center gap-2 text-slate-700 font-semibold mb-2"><HeartPulse className="h-5 w-5"/> Wellbeing Goals</div>
              <div className="space-y-3">
                {wellbeingGoals.map(g=>{
                  const val = wellbeingProgress[g.id]||0;
                  const pct = Math.min(100, Math.round((val / g.monthlyTarget) * 100));
                  return (
                    <div key={g.id} className="bg-white rounded-lg p-3 border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-slate-800">{g.name}</div>
                        <div className="text-xs text-slate-600">{val}/{g.monthlyTarget}</div>
                </div>
                      <div className="h-2 rounded-full bg-slate-200">
                        <div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: g.color }} />
                      </div>
                      <div className="mt-2 flex gap-2">
                        <button className="px-2 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-50" onClick={()=>incWellbeing(g.id, -1)}>-1</button>
                        <button className="px-2 py-1 rounded-md bg-purple-600 text-white hover:bg-purple-700" onClick={()=>incWellbeing(g.id, 1)}>Log today +1</button>
                      </div>
                    </div>
                  );
                })}
                </div>
              </div>
          </div>
        </div>

        {/* Print styles - minimal (no color blocks, hide header/buttons/footer) */}
        <style>{`
          @page { size: A4; margin: 12mm; }
          @media print {
            /* Hide gradients/header/controls/footer */
            .no-print, footer, .site-footer, .app-footer { display: none !important; }
            body { background: white; }
            /* Remove shadows and blur backgrounds */
            .shadow, .shadow-sm, .shadow-md, .shadow-lg { box-shadow: none !important; }
            .backdrop-blur-md { backdrop-filter: none !important; }
            /* Flatten card backgrounds to white */
            .print-mono * { background: white !important; }
            /* Borders remain淡灰，文本黑白 */
            * { color: #111 !important; -webkit-print-color-adjust: economy; print-color-adjust: economy; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default MonthlyPlanner;



