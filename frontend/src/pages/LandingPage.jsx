import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, Heart, Shield, Zap, Eye, Droplets, Sun, Gamepad2, Info, Activity } from "lucide-react";
import { AnimatedAssistant } from "../components/AnimatedAssistant";

const LandingPage = () => {
  const navigate = useNavigate();
  const [assistantOpen, setAssistantOpen] = useState(true);

  const features = [
    {
      icon: Heart,
      title: "Health First",
      description: "Prioritize your wellbeing with personalized workspace recommendations"
    },
    {
      icon: Shield,
      title: "Safe Work",
      description: "Follow government standards for ergonomic office setups"
    },
    {
      icon: Zap,
      title: "Quick Assessment",
      description: "Get instant feedback on your workspace in just minutes"
    }
  ];

  const quickLinks = [
    { to: "/activity-reminder", label: "Activity Reminder", icon: Activity, color: "from-emerald-100 to-green-100", iconColor: "text-emerald-700" },
    { to: "/eye-health-analysis", label: "Eye Health Analysis", icon: Eye, color: "from-sky-100 to-indigo-100", iconColor: "text-sky-700" },
    { to: "/hydration-reminder", label: "Hydration Reminder", icon: Droplets, color: "from-cyan-100 to-teal-100", iconColor: "text-cyan-700" },
    { to: "/vitamin-d-reminder", label: "Vitamin D Reminder", icon: Sun, color: "from-amber-100 to-yellow-100", iconColor: "text-amber-600" },
    { to: "/stress-buster", label: "Stress Buster", icon: Gamepad2, color: "from-pink-100 to-rose-100", iconColor: "text-pink-600" },
    { to: "/health-info", label: "Health Info", icon: Info, color: "from-violet-100 to-purple-100", iconColor: "text-violet-700" },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-sky-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-br from-sky-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-gradient-to-br from-pink-200/20 to-orange-200/20 rounded-full blur-3xl"></div>
      </div>
      {/* Hero Section */}
      <section className="relative px-4 pt-16 pb-20 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Hero Content */}
          <div className="relative bg-white/20 backdrop-blur-md text-white rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl border border-white/30 overflow-hidden">
            {/* Glass effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-sky-600/80 to-sky-800/80"></div>
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 bg-sky-500/20 text-sky-100 px-4 py-2 rounded-full text-sm font-medium">
                <Heart size={16} />
                Welcome to OfficeEz
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                Hi, welcome to{" "}
                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  OfficeEz
                </span>{" "}
                👋
              </h1>
              
              <p className="text-lg sm:text-xl text-sky-100 max-w-2xl mx-auto leading-relaxed">
                I am your assistant and I'll guide you to a healthier workspace. 
                Transform your office setup with personalized recommendations.
              </p>
              
              <div className="pt-4">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                  <button 
                    onClick={() => navigate("/healthy")}
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-white to-sky-50 text-sky-600 font-semibold px-8 py-4 rounded-xl hover:from-sky-50 hover:to-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 border border-white/50"
                  >
                    Let's Start
                    <ArrowRight size={20} />
                  </button>
                  
                  <button 
                    onClick={() => setAssistantOpen(true)}
                    className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white border border-white/40 font-medium px-6 py-3 rounded-xl hover:bg-white/30 hover:border-white/60 transition-all duration-300"
                  >
                    <Heart size={18} />
                    Get Help
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description }, index) => (
              <div 
                key={title}
                className="relative bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/30"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="bg-gradient-to-br from-sky-100 to-orange-100 p-3 rounded-full shadow-md">
                    <Icon className="text-sky-600" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Links */}
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Quick Links</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {quickLinks.map(({ to, label, icon: Icon, color, iconColor }) => (
                <Link
                  key={to}
                  to={to}
                  className={`group relative bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30 hover:bg-white/30 transition-all duration-300 hover:-translate-y-0.5 shadow-md hover:shadow-lg`}
                >
                  <div className={`inline-flex items-center justify-center bg-gradient-to-br ${color} p-2 rounded-lg mb-3 shadow`}> 
                    <Icon className={`${iconColor}`} size={20} />
                  </div>
                  <div className="text-sm font-medium text-slate-800 group-hover:text-slate-900">{label}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Animated Assistant */}
      <AnimatedAssistant
        open={assistantOpen}
        name="OfficeEz Assistant"
        position="bottom-right"
        accent="sky"
        steps={[
          { text: "Hi! I'm your OfficeEz assistant. Let me help you get started! 👋" },
          { text: "I'll guide you through creating a healthier workspace environment." },
          { text: "Click 'Let's Start' above to begin your ergonomic assessment!" },
          { text: "Feel free to explore our features or ask me anything about workspace health." }
        ]}
        onClose={() => setAssistantOpen(false)}
        onFinish={() => setAssistantOpen(false)}
        width={380}
        typingSpeed={25}
      />
    </div>
  );
};

export default LandingPage;