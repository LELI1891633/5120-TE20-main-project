import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  CalendarDays, 
  CalendarRange,
  ArrowLeft,
  Clock,
  Target,
  TrendingUp
} from "lucide-react";

const PlannerHub = () => {
  const navigate = useNavigate();

  const plannerTypes = [
    {
      id: "daily",
      title: "Daily Planner",
      description: "Plan your day with tasks, breaks, and wellbeing reminders",
      icon: Calendar,
      color: "from-blue-500 to-indigo-600",
      features: ["Task Management", "Break Scheduling", "Wellbeing Reminders", "Time Tracking"],
      route: "/daily-planner"
    },
    {
      id: "monthly",
      title: "Monthly Planner",
      description: "Strategic planning with long-term goals and milestone tracking",
      icon: CalendarRange,
      color: "from-purple-500 to-violet-600",
      features: ["Monthly Goals", "Milestone Tracking", "Strategic Planning", "Progress Analytics"],
      route: "/monthly-planner"
    },
    {
      id: "monthly-wellbeing",
      title: "Monthly + Wellbeing",
      description: "Calendar with exercise/mindfulness chips and monthly summary",
      icon: CalendarRange,
      color: "from-blue-500 to-cyan-600",
      features: ["Calendar", "Exercise / Mindfulness", "Month Summary"],
      route: "/monthly-wellbeing"
    }
  ];

  const handlePlannerSelect = (route) => {
    navigate(route);
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
        <div className="mb-12">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/20 px-4 py-2 font-medium text-slate-700 shadow-sm backdrop-blur-md transition-all duration-200 hover:bg-white/30 hover:shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          
          <div className="text-center">
            <div className="mb-6 flex items-center justify-center gap-3">
              <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 p-4">
                <Calendar className="text-white" size={32} />
              </div>
              <h1 className="text-4xl font-bold text-slate-800 sm:text-5xl">
                Planner Hub
              </h1>
            </div>
            <p className="mx-auto max-w-3xl text-xl text-slate-600">
              Choose your planning style - from daily tasks to monthly goals, we've got you covered
            </p>
          </div>
        </div>

        {/* Planner Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-6xl mx-auto justify-items-stretch">
          {plannerTypes.map((planner) => {
            const IconComponent = planner.icon;
            return (
              <div
                key={planner.id}
                className="group relative overflow-hidden rounded-2xl border border-white/30 bg-white/20 p-8 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
                onClick={() => handlePlannerSelect(planner.route)}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${planner.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                {/* Icon */}
                <div className={`mb-6 inline-flex rounded-2xl bg-gradient-to-r ${planner.color} p-4 shadow-lg`}>
                  <IconComponent className="text-white" size={32} />
                </div>
                
                {/* Content */}
                <div className="relative z-10">
                  <h3 className="mb-3 text-2xl font-bold text-slate-800">
                    {planner.title}
                  </h3>
                  <p className="mb-6 text-slate-600 leading-relaxed">
                    {planner.description}
                  </p>
                  
                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="mb-3 text-sm font-semibold text-slate-700 uppercase tracking-wide">
                      Key Features
                    </h4>
                    <ul className="space-y-2">
                      {planner.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-slate-600">
                          <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* CTA Button */}
                  <button
                    className={`w-full rounded-xl bg-gradient-to-r ${planner.color} px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:brightness-105 hover:shadow-xl`}
                  >
                    Start Planning
                  </button>
                </div>
                
                {/* Hover effect */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/20 transition-colors duration-300" />
              </div>
            );
          })}
        </div>

        {/* Additional Info Section */}
        <div className="rounded-2xl border border-white/30 bg-white/20 p-8 shadow-xl backdrop-blur-md">
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-bold text-slate-800">
              Why Use Our Planners?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center">
                <div className="mb-4 rounded-full bg-blue-100 p-4">
                  <Clock className="text-blue-600" size={24} />
                </div>
                <h3 className="mb-2 font-semibold text-slate-800">Time Management</h3>
                <p className="text-center text-sm text-slate-600">
                  Efficiently organize your time with smart scheduling and reminders
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="mb-4 rounded-full bg-green-100 p-4">
                  <Target className="text-green-600" size={24} />
                </div>
                <h3 className="mb-2 font-semibold text-slate-800">Goal Achievement</h3>
                <p className="text-center text-sm text-slate-600">
                  Set and track your goals with progress monitoring and analytics
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="mb-4 rounded-full bg-purple-100 p-4">
                  <TrendingUp className="text-purple-600" size={24} />
                </div>
                <h3 className="mb-2 font-semibold text-slate-800">Wellbeing Focus</h3>
                <p className="text-center text-sm text-slate-600">
                  Balance work and wellness with integrated health reminders
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlannerHub;


