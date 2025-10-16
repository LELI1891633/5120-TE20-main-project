import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  Clock, 
  Download, 
  Plus, 
  Trash2, 
  ArrowLeft,
  Droplets,
  Activity,
  Sun,
  Coffee,
  CheckCircle
} from "lucide-react";

const DailyPlanner = () => {
  const navigate = useNavigate();
  const [workStart, setWorkStart] = useState("09:00");
  const [workEnd, setWorkEnd] = useState("17:00");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  // Tasks with quick tags and estimates (as in the reference UI)
  const TASK_TAGS = [
    { key: "email", label: "📧 Email" },
    { key: "call", label: "📞 Call" },
    { key: "meeting", label: "🗓️ Meeting" },
    { key: "focus", label: "🧠 Focus Block" },
    { key: "write", label: "📝 Write" },
  ];
  const TASK_EST = ["15m", "30m", "60m"];
  const [tasks, setTasks] = useState([
    { text: "", done: false },
    { text: "", done: false },
    { text: "", done: false },
    { text: "", done: false },
  ]);
  const [newTask, setNewTask] = useState("");
  const [breakDuration, setBreakDuration] = useState(15);
  const [breaks, setBreaks] = useState([]);
  const [wellbeingPrompts, setWellbeingPrompts] = useState({
    hydration: true,
    stretch: true,
    outdoor: true
  });
  
  // Deadlines (daily) — simple list similar to monthly needs
  const [deadlines, setDeadlines] = useState([]);
  const [dlTitle, setDlTitle] = useState("");
  const [dlTime, setDlTime] = useState("13:00");
  const [dlOwner, setDlOwner] = useState("");
  const plannerRef = useRef(null);
  // Removed schedule grid; time is now per-task
  const [notes, setNotes] = useState("");
  const [inboxText, setInboxText] = useState("");
  const [inbox, setInbox] = useState([]);
  // Right-column UI (mood, gratitude, prompts)
  const themes = [
    { key: "calm", label: "Calm" },
    { key: "energise", label: "Energise" },
    { key: "focus", label: "Focus" },
    { key: "connect", label: "Connect" },
  ];
  const facts = {
    calm: [
      "60–120 seconds of slow breathing can reduce perceived stress.",
      "Brief screen breaks lower eye strain during long desk sessions.",
    ],
    energise: [
      "2–3 minutes of movement can improve alertness.",
      "Standing for a few minutes each hour supports circulation.",
    ],
    focus: [
      "Single‑tasking beats multitasking for deep work blocks.",
      "Micro‑tasks (5–10 min) help overcome task initiation friction.",
    ],
    connect: [
      "A quick check‑in with a teammate can boost mood and belonging.",
      "Sharing a small win fosters team connection.",
    ],
  };
  const [theme, setTheme] = useState("focus");
  const themeFact = React.useMemo(() => {
    const arr = facts[theme] || [];
    if (!arr.length) return "";
    // Stable display: use the first entry for the selected theme
    return arr[0];
  }, [theme]);
  const [gratColleague, setGratColleague] = useState("");
  const [gratTool, setGratTool] = useState("");
  const [gratWin, setGratWin] = useState("");
  const [gratKindness, setGratKindness] = useState("");
  const [hydration, setHydration] = useState(Array(8).fill(false));
  const hydrationPct = Math.round((hydration.filter(Boolean).length / hydration.length) * 100);
  const [stretchChecks, setStretchChecks] = useState([false, false, false]);
  const [outdoorPlanned, setOutdoorPlanned] = useState(false);
  const [outdoorTime, setOutdoorTime] = useState("");
  // Extra UI states inspired by the screenshot
  const [priority, setPriority] = useState(["", "", ""]);
  // (theme/facts already defined above); remove duplicate gratitude declarations
  


  const addTask = () => setTasks((t) => [...t, { text: "", done: false }]);

  const removeTask = (index) => setTasks(tasks.filter((_, i) => i !== index));

  

  

  const handlePrint = () => {
    window.print();
  };

  const addDeadline = () => {
    const t = dlTitle.trim();
    if (!t) return;
    setDeadlines((arr) => [
      ...arr,
      { id: Math.random().toString(36).slice(2), title: t, time: dlTime, owner: dlOwner.trim() || undefined, done: false },
    ]);
    setDlTitle("");
    setDlOwner("");
    setDlTime("13:00");
  };
  const toggleDeadline = (id) => setDeadlines((arr) => arr.map((d) => (d.id === id ? { ...d, done: !d.done } : d)));
  const removeDeadline = (id) => setDeadlines((arr) => arr.filter((d) => d.id !== id));

  // Quick inbox helpers
  const addInbox = () => {
    const v = inboxText.trim();
    if (!v) return;
    setInbox((arr) => [...arr, v]);
    setInboxText("");
  };
  const sendInboxToTasks = (i) => {
    const item = inbox[i];
    if (!item) return;
    setTasks((arr) => [
      { text: item, done: false },
      ...arr,
    ]);
    setInbox((arr) => arr.filter((_, idx) => idx !== i));
  };
  const addBreak = () => setBreaks((b) => [...b, ""]);


  return (
    <div className="daily-root relative min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-sky-50 py-6 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute top-0 right-1/3 h-80 w-80 rounded-full bg-gradient-to-br from-orange-200/40 to-pink-200/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-gradient-to-br from-sky-200/40 to-pink-200/40 blur-3xl" />
      </div>
      
      <div className="relative z-10 mx-auto max-w-6xl print-mono">
        {/* Header */}
        <div className="mb-8 no-print">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/20 px-4 py-2 font-medium text-slate-700 shadow-sm backdrop-blur-md transition-all duration-200 hover:bg-white/30 hover:shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          
          <div className="text-center">
            <div className="mb-4 flex items-center justify-center gap-3">
              <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 p-4">
                <Calendar className="text-white" size={32} />
              </div>
              <h1 className="text-3xl font-bold text-slate-800 sm:text-4xl">
                Daily Planner Generator
              </h1>
            </div>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">
              Create your personalized daily planner with tasks, breaks, and wellbeing reminders
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <button onClick={handlePrint} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors">
                <Download size={16} />
                Download / Print
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column */}
          <div className="space-y-6">

            {/* Tasks */}
            <div className="rounded-2xl border border-white/30 bg-white/20 p-6 shadow-xl backdrop-blur-md print-only">
              <h3 className="mb-4 text-xl font-semibold text-slate-800">Tasks</h3>
              <div className="space-y-4">
                {tasks.map((t, i) => (
                  <div key={i} className="space-y-2 rounded-xl border border-blue-100 p-3">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" checked={t.done} onChange={(e)=>setTasks(arr=>arr.map((v,idx)=>idx===i?{...v,done:e.target.checked}:v))} />
                      <input
                        placeholder={`Task ${i+1}`}
                        value={t.text}
                        onChange={(e)=>setTasks(arr=>arr.map((v,idx)=>idx===i?{...v,text:e.target.value}:v))}
                        className="flex-1 rounded-lg border border-blue-200 px-3 py-2 focus:border-blue-500"
                      />
                      <button onClick={()=>removeTask(i)} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 size={14}/></button>
                    </div>
                    {/* Quick tags */}
                    <div className="flex flex-wrap items-center gap-2 pl-7">
                      <div className="flex flex-wrap gap-2">
                        {TASK_TAGS.map(tag => (
                          <button key={tag.key} type="button" className={`rounded-full px-3 py-1 text-xs border ${t.tag===tag.key? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50'}`} onClick={()=>setTasks(arr=>arr.map((v,idx)=>idx===i?{...v,tag:tag.key}:v))}>{tag.label}</button>
                        ))}
                      </div>
                      <span className="mx-1 text-blue-300">•</span>
                      <div className="flex gap-2">
                        {TASK_EST.map(est => (
                          <button key={est} type="button" className={`rounded-full px-3 py-1 text-xs border ${t.estimate===est? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50'}`} onClick={()=>setTasks(arr=>arr.map((v,idx)=>idx===i?{...v,estimate:est}:v))}>{est}</button>
                        ))}
                      </div>
                    </div>
                    {(t.tag || t.estimate) && (
                      <div className="pl-7 text-xs text-blue-900/70">
                        {t.tag && <span className="mr-2">Tag: {TASK_TAGS.find(x=>x.key===t.tag)?.label}</span>}
                        {t.estimate && <span>Est: {t.estimate}</span>}
                      </div>
                    )}
                    {/* Per-task time and block details */}
                    <div className="pl-7 grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-3">
                      <input
                        type="time"
                        value={t.time || ""}
                        onChange={(e)=>setTasks(arr=>arr.map((v,idx)=>idx===i?{...v,time:e.target.value}:v))}
                        className="rounded-lg border border-blue-200 px-3 py-2 bg-white"
                      />
                      <input
                        placeholder="Block / Meeting / Focus Block"
                        value={t.block || ""}
                        onChange={(e)=>setTasks(arr=>arr.map((v,idx)=>idx===i?{...v,block:e.target.value}:v))}
                        className="rounded-lg border border-blue-200 px-3 py-2 bg-white/90"
                      />
                    </div>
                  </div>
                ))}
                <div className="mt-2 flex flex-wrap gap-2">
                  <button onClick={addTask} className="rounded-2xl bg-white text-blue-700 border border-blue-200 hover:bg-blue-50 px-3 py-2"><Plus className="inline mr-1" size={14}/>Add Task</button>
                </div>
              </div>
            </div>


            

            {/* Wellbeing Prompts */}
            <div className="rounded-2xl border border-white/30 bg-white/20 p-6 shadow-xl backdrop-blur-md">
              <h3 className="mb-4 text-xl font-semibold text-slate-800">Wellbeing Reminders</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={wellbeingPrompts.hydration}
                    onChange={(e) => setWellbeingPrompts({...wellbeingPrompts, hydration: e.target.checked})}
                    className="rounded border-gray-300"
                  />
                  <Droplets size={16} className="text-blue-500" />
                  <span className="text-slate-700">Hydration Reminders</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={wellbeingPrompts.stretch}
                    onChange={(e) => setWellbeingPrompts({...wellbeingPrompts, stretch: e.target.checked})}
                    className="rounded border-gray-300"
                  />
                  <Activity size={16} className="text-green-500" />
                  <span className="text-slate-700">Stretch Reminders</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={wellbeingPrompts.outdoor}
                    onChange={(e) => setWellbeingPrompts({...wellbeingPrompts, outdoor: e.target.checked})}
                    className="rounded border-gray-300"
                  />
                  <Sun size={16} className="text-yellow-500" />
                  <span className="text-slate-700">Outdoor Time Reminders</span>
                </label>
              </div>
            </div>

            {/* Removed redundant Generate button */}
          </div>

          {/* Right column: Mood, Notes, Gratitude, Quick Inbox, Prompts */}
          <div className="space-y-6">
            {/* Mood Theme & Fact */}
            <div className="rounded-2xl border border-white/30 bg-white/20 p-6 shadow-xl backdrop-blur-md print-only">
              <h3 className="mb-4 text-xl font-semibold text-slate-800">Mood Theme & Fact</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {themes.map(t=> (
                  <button key={t.key} onClick={()=>setTheme(t.key)} className={`px-3 py-1 rounded-full text-sm border ${theme===t.key? 'bg-blue-600 text-white border-blue-600':'bg-white text-blue-700 border-blue-200 hover:bg-blue-50'}`}>{t.label}</button>
                ))}
              </div>
              <p className="text-sm leading-relaxed border-l pl-3 border-blue-200 text-slate-700">
                {themeFact} <span className="block text-[11px] italic text-slate-500">Informational only. No personal data collected.</span>
              </p>
            </div>

            {/* Notes */}
            <div className="rounded-2xl border border-white/30 bg-white/20 p-6 shadow-xl backdrop-blur-md print-only print-keep notes-card">
              <h3 className="mb-2 text-xl font-semibold text-slate-800">Notes</h3>
              <textarea className="w-full rounded-lg border border-gray-300 p-3 h-32 focus:border-blue-500 focus:outline-none" value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder="Key reminders & reflections…" />
            </div>

            {/* Gratitude */}
            <div className="rounded-2xl border border-white/30 bg-white/20 p-6 shadow-xl backdrop-blur-md no-print">
              <h3 className="mb-2 text-xl font-semibold text-slate-800">Gratitude (at work)</h3>
              <div className="space-y-2">
                <input value={gratColleague} onChange={(e)=>setGratColleague(e.target.value)} placeholder="🙏 A colleague I appreciate today & why" className="w-full rounded-lg border border-blue-200 px-3 py-2" />
                <input value={gratTool} onChange={(e)=>setGratTool(e.target.value)} placeholder="🛠️ A process/tool that made work smoother today" className="w-full rounded-lg border border-blue-200 px-3 py-2" />
                <input value={gratWin} onChange={(e)=>setGratWin(e.target.value)} placeholder="✨ A small win I’m proud of" className="w-full rounded-lg border border-blue-200 px-3 py-2" />
                <input value={gratKindness} onChange={(e)=>setGratKindness(e.target.value)} placeholder="🌱 One act of kindness I’ll do" className="w-full rounded-lg border border-blue-200 px-3 py-2" />
                <p className="text-xs text-slate-600">Tiny wins fuel big weeks — jot a line to celebrate and keep momentum ✨</p>
              </div>
            </div>

            {/* Quick Inbox */}
            <div className="rounded-2xl border border-white/30 bg-white/20 p-6 shadow-xl backdrop-blur-md no-print">
              <h3 className="mb-2 text-xl font-semibold text-slate-800">Quick Inbox (capture)</h3>
              <div className="flex gap-2">
                <input value={inboxText} onChange={(e)=>setInboxText(e.target.value)} placeholder="Capture ideas" className="flex-1 rounded-lg border border-blue-200 px-3 py-2" />
                <button onClick={addInbox} className="rounded-lg bg-blue-600 text-white px-4 py-2 hover:bg-blue-700">Add</button>
              </div>
              <ul className="mt-3 space-y-2">
                {inbox.map((it,i)=> (
                  <li key={i} className="flex items-center justify-between rounded-lg border border-blue-100 p-2 text-sm bg-white">
                    <span className="pr-3">{it}</span>
                    <div className="flex gap-2">
                      <button className="rounded-lg bg-white text-blue-700 border border-blue-200 px-3 py-1 hover:bg-blue-50" onClick={()=>sendInboxToTasks(i)}>Send to Tasks</button>
                      <button className="rounded-lg text-blue-700 px-3 py-1 hover:bg-blue-50" onClick={()=>setInbox((arr)=>arr.filter((_,idx)=>idx!==i))}>Remove</button>
                    </div>
                  </li>
                ))}
                {!inbox.length && (<li className="text-xs text-slate-600">Nothing captured yet — jot something above ✨</li>)}
              </ul>
            </div>

            {/* Wellbeing Prompts (right-side widgets) */}
            <div className="rounded-2xl border border-white/30 bg-white/20 p-6 shadow-xl backdrop-blur-md no-print">
              <h3 className="mb-3 text-xl font-semibold text-slate-800">Wellbeing Prompts</h3>
              {/* Hydration */}
              <div className="mb-3">
                <div className="mb-1 flex items-center gap-2 font-medium text-slate-800">
                  <Droplets className="h-4 w-4" /> <span className="text-sm">Hydration</span>
                  <span className="ml-2 text-xs text-slate-600">{hydrationPct}%</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {hydration.map((v, i) => (
                    <button key={i} type="button" className={`rounded-full h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center border ${v ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50'}`} onClick={() => setHydration((arr) => arr.map((x, idx) => (idx === i ? !x : x)))}>💧</button>
                  ))}
                </div>
              </div>
              {/* Stretch */}
              <div className="mb-3">
                <div className="mb-1 flex items-center gap-2 font-medium text-slate-800"><span className="text-sm">Stretch (3 sessions)</span></div>
                <div className="flex flex-wrap gap-3">
                  {stretchChecks.map((v, i) => (
                    <label key={i} className="flex items-center gap-2 text-sm w-[46%] xs:w-auto sm:w-auto">
                      <input className="h-5 w-5 sm:h-4 sm:w-4" type="checkbox" checked={v} onChange={(e)=>setStretchChecks((arr)=>arr.map((x,idx)=>idx===i? e.target.checked : x))} />
                      {`Session ${i+1}`}
                    </label>
                  ))}
                </div>
                <p className="text-xs text-slate-600 mt-1">Tip: 60–90 seconds of neck/shoulder/hip mobility works well.</p>
              </div>
              {/* Outdoor */}
              <div>
                <div className="mb-1 flex items-center gap-2 font-medium text-slate-800"><span className="text-sm">Outdoor Time (15–20 min)</span></div>
                <div className="flex items-center gap-3 flex-wrap">
                  <input className="h-5 w-5 sm:h-4 sm:w-4" type="checkbox" checked={outdoorPlanned} onChange={(e)=>setOutdoorPlanned(e.target.checked)} />
                  <input placeholder="e.g., 12:30 Lunch Walk" value={outdoorTime} onChange={(e)=>setOutdoorTime(e.target.value)} className="rounded-lg border border-blue-200 px-3 py-2 flex-1 min-w-[220px]" />
                </div>
                <p className="text-xs text-slate-600 mt-1">Sunlight & fresh air support energy and circadian rhythm.</p>
              </div>
            </div>
          </div>
        </div>
        {/* Preview section removed */}
        <style>{`
          @media print {
            @page { margin: 12mm; }
            /* Hide header, gratitude, inbox, prompts during print */
            .no-print { display: none !important; }
            /* Hide global/site footer and legal sections */
            footer, .site-footer, .app-footer { display: none !important; }
            /* Remove shadows/blur and flatten backgrounds to white */
            .shadow, .shadow-sm, .shadow-md, .shadow-lg { box-shadow: none !important; }
            .backdrop-blur-md { backdrop-filter: none !important; }
            .print-mono * { background: white !important; }
            /* Prefer monochrome for print */
            * { color: #111 !important; -webkit-print-color-adjust: economy; print-color-adjust: economy; }
            /* Keep important cards intact on a single page when possible */
            .print-keep { break-inside: avoid !important; page-break-inside: avoid !important; }
            /* Make textarea content fully visible on print */
            .notes-card textarea { height: auto !important; overflow: visible !important; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default DailyPlanner;
 
/* Print styles: only print selected sections */
/* Injected at end of file via style tag in JSX is not trivial here; we rely on global CSS rules below */
