import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  CalendarDays, 
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
  CheckCircle,
  Target,
  TrendingUp,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const WeeklyPlanner = () => {
  const navigate = useNavigate();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [weeklyGoals, setWeeklyGoals] = useState([
    "Complete project milestone",
    "Exercise 4 times this week",
    "Read 2 chapters of book",
    "Practice mindfulness daily"
  ]);
  const [newGoal, setNewGoal] = useState("");
  const [dailyTasks, setDailyTasks] = useState({
    monday: ["Team standup", "Code review"],
    tuesday: ["Client meeting", "Documentation"],
    wednesday: ["Sprint planning", "Testing"],
    thursday: ["Feature development", "Code review"],
    friday: ["Weekly review", "Planning next week"]
  });
  const [newTask, setNewTask] = useState({ day: "", task: "" });
  const [wellbeingGoals, setWellbeingGoals] = useState({
    exercise: { target: 4, current: 0 },
    hydration: { target: 7, current: 0 },
    mindfulness: { target: 7, current: 0 },
    outdoor: { target: 3, current: 0 }
  });
  const [generatedPlanner, setGeneratedPlanner] = useState(null);
  const plannerRef = useRef(null);

  const daysOfWeek = [
    { key: 'monday', label: 'Monday', short: 'Mon' },
    { key: 'tuesday', label: 'Tuesday', short: 'Tue' },
    { key: 'wednesday', label: 'Wednesday', short: 'Wed' },
    { key: 'thursday', label: 'Thursday', short: 'Thu' },
    { key: 'friday', label: 'Friday', short: 'Fri' },
    { key: 'saturday', label: 'Saturday', short: 'Sat' },
    { key: 'sunday', label: 'Sunday', short: 'Sun' }
  ];

  const getWeekDates = (date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);
      dates.push(currentDate);
    }
    return dates;
  };

  const weekDates = getWeekDates(currentWeek);

  const navigateWeek = (direction) => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + (direction * 7));
    setCurrentWeek(newDate);
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      setWeeklyGoals([...weeklyGoals, newGoal.trim()]);
      setNewGoal("");
    }
  };

  const removeGoal = (index) => {
    setWeeklyGoals(weeklyGoals.filter((_, i) => i !== index));
  };

  const addTask = () => {
    if (newTask.day && newTask.task.trim()) {
      setDailyTasks({
        ...dailyTasks,
        [newTask.day]: [...dailyTasks[newTask.day], newTask.task.trim()]
      });
      setNewTask({ day: "", task: "" });
    }
  };

  const removeTask = (day, index) => {
    setDailyTasks({
      ...dailyTasks,
      [day]: dailyTasks[day].filter((_, i) => i !== index)
    });
  };

  const updateWellbeingGoal = (goal, value) => {
    setWellbeingGoals({
      ...wellbeingGoals,
      [goal]: { ...wellbeingGoals[goal], current: Math.max(0, value) }
    });
  };

  const generatePlanner = () => {
    const weekStart = weekDates[0].toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric' 
    });
    const weekEnd = weekDates[6].toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });

    const planner = {
      weekRange: `${weekStart} - ${weekEnd}`,
      weeklyGoals: weeklyGoals,
      dailyTasks: dailyTasks,
      wellbeingGoals: wellbeingGoals,
      progress: {
        totalGoals: weeklyGoals.length,
        completedGoals: Math.floor(weeklyGoals.length * 0.3), // Simulated progress
        wellbeingProgress: Object.entries(wellbeingGoals).map(([key, goal]) => ({
          name: key,
          progress: Math.round((goal.current / goal.target) * 100)
        }))
      }
    };

    setGeneratedPlanner(planner);
  };

  const downloadPDF = () => {
    if (!generatedPlanner) return;
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Weekly Planner - ${generatedPlanner.weekRange}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .section { margin-bottom: 25px; }
          .section h3 { color: #333; border-bottom: 2px solid #eee; padding-bottom: 5px; }
          .week-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 15px; margin-bottom: 20px; }
          .day-column { border: 1px solid #ddd; padding: 10px; border-radius: 5px; }
          .day-header { font-weight: bold; text-align: center; margin-bottom: 10px; }
          .task-list { list-style-type: none; padding: 0; }
          .task-list li { padding: 3px 0; font-size: 12px; }
          .progress-bar { background: #f0f0f0; border-radius: 10px; height: 20px; margin: 5px 0; }
          .progress-fill { background: #4CAF50; height: 100%; border-radius: 10px; text-align: center; color: white; font-size: 12px; line-height: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📅 Weekly Planner</h1>
          <h2>${generatedPlanner.weekRange}</h2>
        </div>
        
        <div class="section">
          <h3>🎯 Weekly Goals</h3>
          <ul>
            ${generatedPlanner.weeklyGoals.map(goal => `<li>• ${goal}</li>`).join('')}
          </ul>
        </div>
        
        <div class="section">
          <h3>📋 Daily Tasks</h3>
          <div class="week-grid">
            ${daysOfWeek.map(day => `
              <div class="day-column">
                <div class="day-header">${day.label}</div>
                <ul class="task-list">
                  ${(generatedPlanner.dailyTasks[day.key] || []).map(task => `<li>• ${task}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="section">
          <h3>💪 Wellbeing Progress</h3>
          ${generatedPlanner.wellbeingProgress.map(item => `
            <div>
              <strong>${item.name.charAt(0).toUpperCase() + item.name.slice(1)}</strong>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${item.progress}%">${item.progress}%</div>
              </div>
            </div>
          `).join('')}
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weekly-planner-${new Date().toISOString().split('T')[0]}.html`;
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
      
      <div className="relative z-10 mx-auto max-w-7xl">
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
              <div className="rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 p-4">
                <CalendarDays className="text-white" size={32} />
              </div>
              <h1 className="text-3xl font-bold text-slate-800 sm:text-4xl">
                Weekly Planner Generator
              </h1>
            </div>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">
              Plan your week with goals, tasks, and wellbeing tracking
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <div className="space-y-6">
            {/* Week Navigation */}
            <div className="rounded-2xl border border-white/30 bg-white/20 p-6 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => navigateWeek(-1)}
                  className="p-2 rounded-lg bg-white/50 hover:bg-white/70 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <h3 className="text-xl font-semibold text-slate-800">
                  {weekDates[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {weekDates[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                </h3>
                <button
                  onClick={() => navigateWeek(1)}
                  className="p-2 rounded-lg bg-white/50 hover:bg-white/70 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {/* Weekly Goals */}
            <div className="rounded-2xl border border-white/30 bg-white/20 p-6 shadow-xl backdrop-blur-md">
              <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-slate-800">
                <Target size={20} />
                Weekly Goals
              </h3>
              <div className="space-y-3">
                {weeklyGoals.map((goal, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-white rounded-lg">
                    <CheckCircle size={16} className="text-green-500" />
                    <span className="flex-1 text-slate-700">{goal}</span>
                    <button
                      onClick={() => removeGoal(index)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addGoal()}
                    placeholder="Add a weekly goal..."
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none"
                  />
                  <button
                    onClick={addGoal}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Daily Tasks */}
            <div className="rounded-2xl border border-white/30 bg-white/20 p-6 shadow-xl backdrop-blur-md">
              <h3 className="mb-4 text-xl font-semibold text-slate-800">Daily Tasks</h3>
              <div className="space-y-4">
                {daysOfWeek.slice(0, 5).map((day) => (
                  <div key={day.key} className="bg-white rounded-lg p-4">
                    <h4 className="font-medium text-slate-800 mb-2">{day.label}</h4>
                    <div className="space-y-2">
                      {dailyTasks[day.key]?.map((task, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle size={14} className="text-blue-500" />
                          <span className="flex-1 text-sm text-slate-700">{task}</span>
                          <button
                            onClick={() => removeTask(day.key, index)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="flex gap-2">
                  <select
                    value={newTask.day}
                    onChange={(e) => setNewTask({...newTask, day: e.target.value})}
                    className="rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none"
                  >
                    <option value="">Select day</option>
                    {daysOfWeek.slice(0, 5).map((day) => (
                      <option key={day.key} value={day.key}>{day.label}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={newTask.task}
                    onChange={(e) => setNewTask({...newTask, task: e.target.value})}
                    onKeyPress={(e) => e.key === 'Enter' && addTask()}
                    placeholder="Add task..."
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none"
                  />
                  <button
                    onClick={addTask}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Wellbeing Goals */}
            <div className="rounded-2xl border border-white/30 bg-white/20 p-6 shadow-xl backdrop-blur-md">
              <h3 className="mb-4 text-xl font-semibold text-slate-800">Wellbeing Goals</h3>
              <div className="space-y-4">
                {Object.entries(wellbeingGoals).map(([key, goal]) => (
                  <div key={key} className="bg-white rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-slate-800 capitalize">{key}</h4>
                      <span className="text-sm text-slate-600">
                        {goal.current}/{goal.target}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateWellbeingGoal(key, goal.current - 1)}
                        className="w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                      >
                        -
                      </button>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                        />
                      </div>
                      <button
                        onClick={() => updateWellbeingGoal(key, goal.current + 1)}
                        className="w-8 h-8 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generatePlanner}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:brightness-105 hover:shadow-xl"
            >
              <RefreshCw size={18} />
              Generate Weekly Planner
            </button>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            {generatedPlanner ? (
              <div className="rounded-2xl border border-white/30 bg-white/20 p-6 shadow-xl backdrop-blur-md">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-slate-800">Weekly Planner Preview</h3>
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
                  className="rounded-xl p-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg"
                >
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold mb-2">📅 Weekly Planner</h2>
                    <p className="text-lg opacity-90">{generatedPlanner.weekRange}</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        🎯 Weekly Goals
                      </h3>
                      <ul className="space-y-1">
                        {generatedPlanner.weeklyGoals.map((goal, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-white rounded-full"></span>
                            {goal}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        💪 Wellbeing Progress
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {generatedPlanner.wellbeingProgress.map((item, index) => (
                          <div key={index} className="bg-white/20 rounded-lg p-3">
                            <div className="text-sm font-medium capitalize">{item.name}</div>
                            <div className="mt-1 bg-white/30 rounded-full h-2">
                              <div 
                                className="bg-white h-2 rounded-full transition-all duration-300"
                                style={{ width: `${item.progress}%` }}
                              />
                            </div>
                            <div className="text-xs mt-1">{item.progress}%</div>
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
                  <CalendarDays size={48} className="mx-auto text-slate-400 mb-4" />
                  <h3 className="text-lg font-semibold text-slate-600 mb-2">No Weekly Planner Generated</h3>
                  <p className="text-slate-500">Configure your settings and click "Generate Weekly Planner" to see a preview</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyPlanner;

