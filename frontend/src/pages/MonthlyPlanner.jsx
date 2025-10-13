import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  CalendarRange, 
  Clock, 
  Download, 
  RefreshCw, 
  Plus, 
  Trash2, 
  ArrowLeft,
  Target,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Calendar,
  BarChart3,
  Award
} from "lucide-react";

const MonthlyPlanner = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthlyGoals, setMonthlyGoals] = useState([
    "Complete major project milestone",
    "Launch new product feature",
    "Improve team productivity by 20%",
    "Achieve work-life balance goals"
  ]);
  const [newGoal, setNewGoal] = useState("");
  const [milestones, setMilestones] = useState([
    { id: 1, title: "Project Phase 1 Complete", date: "2024-01-15", status: "completed" },
    { id: 2, title: "Team Training Session", date: "2024-01-22", status: "in-progress" },
    { id: 3, title: "Quarterly Review", date: "2024-01-31", status: "pending" }
  ]);
  const [newMilestone, setNewMilestone] = useState({ title: "", date: "" });
  const [strategicObjectives, setStrategicObjectives] = useState({
    professional: { target: 5, current: 2 },
    personal: { target: 3, current: 1 },
    health: { target: 4, current: 3 },
    learning: { target: 2, current: 1 }
  });
  const [generatedPlanner, setGeneratedPlanner] = useState(null);
  const plannerRef = useRef(null);

  const getMonthName = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newDate);
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      setMonthlyGoals([...monthlyGoals, newGoal.trim()]);
      setNewGoal("");
    }
  };

  const removeGoal = (index) => {
    setMonthlyGoals(monthlyGoals.filter((_, i) => i !== index));
  };

  const addMilestone = () => {
    if (newMilestone.title.trim() && newMilestone.date) {
      const milestone = {
        id: Date.now(),
        title: newMilestone.title.trim(),
        date: newMilestone.date,
        status: "pending"
      };
      setMilestones([...milestones, milestone]);
      setNewMilestone({ title: "", date: "" });
    }
  };

  const removeMilestone = (id) => {
    setMilestones(milestones.filter(m => m.id !== id));
  };

  const updateMilestoneStatus = (id, status) => {
    setMilestones(milestones.map(m => 
      m.id === id ? { ...m, status } : m
    ));
  };

  const updateStrategicObjective = (category, value) => {
    setStrategicObjectives({
      ...strategicObjectives,
      [category]: { ...strategicObjectives[category], current: Math.max(0, value) }
    });
  };

  const generatePlanner = () => {
    const monthName = getMonthName(currentMonth);
    const daysInMonth = getDaysInMonth(currentMonth);
    
    const completedMilestones = milestones.filter(m => m.status === 'completed').length;
    const totalMilestones = milestones.length;
    
    const planner = {
      month: monthName,
      daysInMonth: daysInMonth,
      monthlyGoals: monthlyGoals,
      milestones: milestones,
      strategicObjectives: strategicObjectives,
      analytics: {
        goalCompletion: Math.floor((completedMilestones / totalMilestones) * 100),
        strategicProgress: Object.entries(strategicObjectives).map(([key, obj]) => ({
          category: key,
          progress: Math.round((obj.current / obj.target) * 100)
        })),
        monthlyScore: Math.floor(
          (completedMilestones / totalMilestones) * 50 + 
          (Object.values(strategicObjectives).reduce((sum, obj) => sum + (obj.current / obj.target), 0) / Object.keys(strategicObjectives).length) * 50
        )
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
        <title>Monthly Planner - ${generatedPlanner.month}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .section { margin-bottom: 25px; }
          .section h3 { color: #333; border-bottom: 2px solid #eee; padding-bottom: 5px; }
          .milestone-item { border: 1px solid #ddd; padding: 10px; margin: 5px 0; border-radius: 5px; }
          .milestone-completed { background-color: #d4edda; border-color: #c3e6cb; }
          .milestone-in-progress { background-color: #fff3cd; border-color: #ffeaa7; }
          .milestone-pending { background-color: #f8f9fa; border-color: #dee2e6; }
          .progress-bar { background: #f0f0f0; border-radius: 10px; height: 20px; margin: 5px 0; }
          .progress-fill { background: #6f42c1; height: 100%; border-radius: 10px; text-align: center; color: white; font-size: 12px; line-height: 20px; }
          .analytics-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
          .analytics-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📅 Monthly Planner</h1>
          <h2>${generatedPlanner.month}</h2>
          <p>${generatedPlanner.daysInMonth} days to achieve your goals</p>
        </div>
        
        <div class="section">
          <h3>🎯 Monthly Goals</h3>
          <ul>
            ${generatedPlanner.monthlyGoals.map(goal => `<li>• ${goal}</li>`).join('')}
          </ul>
        </div>
        
        <div class="section">
          <h3>🏆 Milestones</h3>
          ${generatedPlanner.milestones.map(milestone => `
            <div class="milestone-item milestone-${milestone.status}">
              <strong>${milestone.title}</strong> - ${milestone.date}
              <span style="float: right; text-transform: capitalize;">${milestone.status}</span>
            </div>
          `).join('')}
        </div>
        
        <div class="section">
          <h3>📊 Strategic Objectives Progress</h3>
          ${generatedPlanner.analytics.strategicProgress.map(item => `
            <div>
              <strong>${item.category.charAt(0).toUpperCase() + item.category.slice(1)}</strong>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${item.progress}%">${item.progress}%</div>
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="section">
          <h3>📈 Monthly Analytics</h3>
          <div class="analytics-grid">
            <div class="analytics-card">
              <h4>Goal Completion</h4>
              <div style="font-size: 24px; font-weight: bold; color: #6f42c1;">${generatedPlanner.analytics.goalCompletion}%</div>
            </div>
            <div class="analytics-card">
              <h4>Monthly Score</h4>
              <div style="font-size: 24px; font-weight: bold; color: #6f42c1;">${generatedPlanner.analytics.monthlyScore}/100</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monthly-planner-${new Date().toISOString().split('T')[0]}.html`;
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
              <div className="rounded-2xl bg-gradient-to-r from-purple-500 to-violet-500 p-4">
                <CalendarRange className="text-white" size={32} />
              </div>
              <h1 className="text-3xl font-bold text-slate-800 sm:text-4xl">
                Monthly Planner Generator
              </h1>
            </div>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">
              Strategic planning with long-term goals and milestone tracking
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <div className="space-y-6">
            {/* Month Navigation */}
            <div className="rounded-2xl border border-white/30 bg-white/20 p-6 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-2 rounded-lg bg-white/50 hover:bg-white/70 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <h3 className="text-xl font-semibold text-slate-800">
                  {getMonthName(currentMonth)}
                </h3>
                <button
                  onClick={() => navigateMonth(1)}
                  className="p-2 rounded-lg bg-white/50 hover:bg-white/70 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              <div className="text-center text-slate-600">
                {getDaysInMonth(currentMonth)} days in this month
              </div>
            </div>

            {/* Monthly Goals */}
            <div className="rounded-2xl border border-white/30 bg-white/20 p-6 shadow-xl backdrop-blur-md">
              <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-slate-800">
                <Target size={20} />
                Monthly Goals
              </h3>
              <div className="space-y-3">
                {monthlyGoals.map((goal, index) => (
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
                    placeholder="Add a monthly goal..."
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none"
                  />
                  <button
                    onClick={addGoal}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Milestones */}
            <div className="rounded-2xl border border-white/30 bg-white/20 p-6 shadow-xl backdrop-blur-md">
              <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-slate-800">
                <Award size={20} />
                Milestones
              </h3>
              <div className="space-y-3">
                {milestones.map((milestone) => (
                  <div key={milestone.id} className="bg-white rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-slate-800">{milestone.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                        milestone.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {milestone.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">{milestone.date}</span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => updateMilestoneStatus(milestone.id, 'completed')}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                        >
                          <CheckCircle size={14} />
                        </button>
                        <button
                          onClick={() => removeMilestone(milestone.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newMilestone.title}
                    onChange={(e) => setNewMilestone({...newMilestone, title: e.target.value})}
                    placeholder="Milestone title..."
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={newMilestone.date}
                      onChange={(e) => setNewMilestone({...newMilestone, date: e.target.value})}
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none"
                    />
                    <button
                      onClick={addMilestone}
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Strategic Objectives */}
            <div className="rounded-2xl border border-white/30 bg-white/20 p-6 shadow-xl backdrop-blur-md">
              <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-slate-800">
                <BarChart3 size={20} />
                Strategic Objectives
              </h3>
              <div className="space-y-4">
                {Object.entries(strategicObjectives).map(([key, objective]) => (
                  <div key={key} className="bg-white rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-slate-800 capitalize">{key}</h4>
                      <span className="text-sm text-slate-600">
                        {objective.current}/{objective.target}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateStrategicObjective(key, objective.current - 1)}
                        className="w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                      >
                        -
                      </button>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((objective.current / objective.target) * 100, 100)}%` }}
                        />
                      </div>
                      <button
                        onClick={() => updateStrategicObjective(key, objective.current + 1)}
                        className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
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
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:brightness-105 hover:shadow-xl"
            >
              <RefreshCw size={18} />
              Generate Monthly Planner
            </button>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            {generatedPlanner ? (
              <div className="rounded-2xl border border-white/30 bg-white/20 p-6 shadow-xl backdrop-blur-md">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-slate-800">Monthly Planner Preview</h3>
                  <button
                    onClick={downloadPDF}
                    className="flex items-center gap-2 rounded-lg bg-purple-500 px-4 py-2 text-white hover:bg-purple-600 transition-colors"
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
                
                <div 
                  ref={plannerRef}
                  className="rounded-xl p-6 bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-lg"
                >
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold mb-2">📅 Monthly Planner</h2>
                    <p className="text-lg opacity-90">{generatedPlanner.month}</p>
                    <p className="text-sm opacity-75">{generatedPlanner.daysInMonth} days to achieve your goals</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        🎯 Monthly Goals
                      </h3>
                      <ul className="space-y-1">
                        {generatedPlanner.monthlyGoals.map((goal, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-white rounded-full"></span>
                            {goal}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        🏆 Milestones Progress
                      </h3>
                      <div className="bg-white/20 rounded-lg p-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold">{generatedPlanner.analytics.goalCompletion}%</div>
                          <div className="text-sm opacity-90">Goal Completion Rate</div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        📊 Strategic Progress
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {generatedPlanner.analytics.strategicProgress.map((item, index) => (
                          <div key={index} className="bg-white/20 rounded-lg p-3">
                            <div className="text-sm font-medium capitalize">{item.category}</div>
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
                    
                    <div className="bg-white/20 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold">Monthly Score</div>
                      <div className="text-4xl font-bold">{generatedPlanner.analytics.monthlyScore}/100</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/30 bg-white/20 p-6 shadow-xl backdrop-blur-md">
                <div className="text-center py-12">
                  <CalendarRange size={48} className="mx-auto text-slate-400 mb-4" />
                  <h3 className="text-lg font-semibold text-slate-600 mb-2">No Monthly Planner Generated</h3>
                  <p className="text-slate-500">Configure your settings and click "Generate Monthly Planner" to see a preview</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyPlanner;

