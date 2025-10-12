import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  Clock, 
  Download, 
  RefreshCw, 
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
  const [tasks, setTasks] = useState([
    "Review project requirements",
    "Team standup meeting",
    "Code review session"
  ]);
  const [newTask, setNewTask] = useState("");
  const [breakDuration, setBreakDuration] = useState(15);
  const [wellbeingPrompts, setWellbeingPrompts] = useState({
    hydration: true,
    stretch: true,
    outdoor: true
  });
  const [generatedPlanner, setGeneratedPlanner] = useState(null);
  const plannerRef = useRef(null);


  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, newTask.trim()]);
      setNewTask("");
    }
  };

  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const generatePlanner = () => {
    const today = new Date();
    const dateString = today.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const planner = {
      date: dateString,
      workHours: `${workStart} - ${workEnd}`,
      tasks: tasks,
      breaks: [
        { time: "10:30", duration: breakDuration, type: "Morning Break" },
        { time: "14:00", duration: breakDuration, type: "Afternoon Break" }
      ],
      wellbeing: [
        { time: "10:00", prompt: "Stay hydrated! Drink a glass of water", icon: "💧", enabled: wellbeingPrompts.hydration },
        { time: "11:30", prompt: "Take a quick stretch break", icon: "🧘‍♀️", enabled: wellbeingPrompts.stretch },
        { time: "15:00", prompt: "Get some fresh air and sunlight", icon: "🌞", enabled: wellbeingPrompts.outdoor }
      ].filter(item => item.enabled)
    };

    setGeneratedPlanner(planner);
  };

  const downloadPDF = () => {
    if (!generatedPlanner) return;
    
    // Create a simple HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Daily Planner - ${generatedPlanner.date}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .section { margin-bottom: 25px; }
          .section h3 { color: #333; border-bottom: 2px solid #eee; padding-bottom: 5px; }
          .task-list { list-style-type: none; padding: 0; }
          .task-list li { padding: 5px 0; }
          .break-item, .wellbeing-item { margin: 8px 0; padding: 8px; background: #f9f9f9; border-radius: 4px; }
          .time { font-weight: bold; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📅 Daily Planner</h1>
          <h2>${generatedPlanner.date}</h2>
          <p>Work Hours: ${generatedPlanner.workHours}</p>
        </div>
        
        <div class="section">
          <h3>📋 Today's Tasks</h3>
          <ul class="task-list">
            ${generatedPlanner.tasks.map(task => `<li>• ${task}</li>`).join('')}
          </ul>
        </div>
        
        <div class="section">
          <h3>☕ Break Times</h3>
          ${generatedPlanner.breaks.map(breakItem => 
            `<div class="break-item">
              <span class="time">${breakItem.time}</span> - ${breakItem.type} (${breakItem.duration} min)
            </div>`
          ).join('')}
        </div>
        
        <div class="section">
          <h3>💧 Wellbeing Reminders</h3>
          ${generatedPlanner.wellbeing.map(item => 
            `<div class="wellbeing-item">
              <span class="time">${item.time}</span> ${item.icon} ${item.prompt}
            </div>`
          ).join('')}
        </div>
      </body>
      </html>
    `;

    // Create and download the file
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily-planner-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };


  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-sky-50 py-6 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute top-0 right-1/3 h-80 w-80 rounded-full bg-gradient-to-br from-orange-200/40 to-pink-200/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-gradient-to-br from-sky-200/40 to-pink-200/40 blur-3xl" />
      </div>
      
      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
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
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <div className="space-y-6">

            {/* Work Hours */}
            <div className="rounded-2xl border border-white/30 bg-white/20 p-6 shadow-xl backdrop-blur-md">
              <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-slate-800">
                <Clock size={20} />
                Work Hours
              </h3>
              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={workStart}
                    onChange={(e) => setWorkStart(e.target.value)}
                    className="rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <span className="text-slate-600 mt-6">to</span>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={workEnd}
                    onChange={(e) => setWorkEnd(e.target.value)}
                    className="rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Tasks */}
            <div className="rounded-2xl border border-white/30 bg-white/20 p-6 shadow-xl backdrop-blur-md">
              <h3 className="mb-4 text-xl font-semibold text-slate-800">Today's Tasks</h3>
              <div className="space-y-3">
                {tasks.map((task, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-white rounded-lg">
                    <CheckCircle size={16} className="text-green-500" />
                    <span className="flex-1 text-slate-700">{task}</span>
                    <button
                      onClick={() => removeTask(index)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTask()}
                    placeholder="Add a new task..."
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  />
                  <button
                    onClick={addTask}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Break Settings */}
            <div className="rounded-2xl border border-white/30 bg-white/20 p-6 shadow-xl backdrop-blur-md">
              <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-slate-800">
                <Coffee size={20} />
                Break Settings
              </h3>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Break Duration (minutes)
                </label>
                <select
                  value={breakDuration}
                  onChange={(e) => setBreakDuration(parseInt(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                >
                  <option value={5}>5 minutes</option>
                  <option value={10}>10 minutes</option>
                  <option value={15}>15 minutes</option>
                  <option value={20}>20 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                </select>
                <p className="mt-1 text-xs text-slate-500">
                  Choose from predefined break durations
                </p>
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

            {/* Generate Button */}
            <button
              onClick={generatePlanner}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:brightness-105 hover:shadow-xl"
            >
              <RefreshCw size={18} />
              Generate Planner
            </button>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            {generatedPlanner ? (
              <div className="rounded-2xl border border-white/30 bg-white/20 p-6 shadow-xl backdrop-blur-md">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-slate-800">Planner Preview</h3>
                  <button
                    onClick={downloadPDF}
                    className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600 transition-colors"
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
                
                <div 
                  ref={plannerRef}
                  className="rounded-xl p-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg"
                >
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold mb-2">📅 Daily Planner</h2>
                    <p className="text-lg opacity-90">{generatedPlanner.date}</p>
                    <p className="text-sm opacity-75">Work Hours: {generatedPlanner.workHours}</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                        📋 Today's Tasks
                      </h3>
                      <ul className="space-y-1">
                        {generatedPlanner.tasks.map((task, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-white rounded-full"></span>
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                        ☕ Break Times
                      </h3>
                      <div className="space-y-2">
                        {generatedPlanner.breaks.map((breakItem, index) => (
                          <div key={index} className="bg-white/20 rounded-lg p-3">
                            <div className="font-medium">{breakItem.time}</div>
                            <div className="text-sm opacity-90">
                              {breakItem.type} ({breakItem.duration} minutes)
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                        💧 Wellbeing Reminders
                      </h3>
                      <div className="space-y-2">
                        {generatedPlanner.wellbeing.map((item, index) => (
                          <div key={index} className="bg-white/20 rounded-lg p-3">
                            <div className="font-medium">{item.time}</div>
                            <div className="text-sm opacity-90">
                              {item.icon} {item.prompt}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/30 bg-white/20 p-6 shadow-xl backdrop-blur-md">
                <div className="text-center py-12">
                  <Calendar size={48} className="mx-auto text-slate-400 mb-4" />
                  <h3 className="text-lg font-semibold text-slate-600 mb-2">No Planner Generated</h3>
                  <p className="text-slate-500">Configure your settings and click "Generate Planner" to see a preview</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyPlanner;
