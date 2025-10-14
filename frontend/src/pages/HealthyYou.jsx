import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Info,
  Eye,
  Sun,
  Coffee,
  Heart,
  ArrowRight,
  CheckCircle,
  Users,
  ArrowLeft,
  Droplet,
} from "lucide-react";

import { AnimatedAssistant } from "../components/AnimatedAssistant";

const HealthyYou = () => {
  const navigate = useNavigate();
  const [assistantOpen, setAssistantOpen] = useState(true);

  const healthTips = [
    {
      icon: Eye,
      title: "Eye Health",
      description: "Follow the 20-20-20 rule for healthy vision",
      tips: [
        "Every 20 minutes, look at something 20 feet away for 20 seconds",
        "Adjust screen brightness to match your surroundings",
        "Use artificial tears if your eyes feel dry",
        "Position your screen arm's length away",
      ],
      color: "blue",
      button: { text: "Start Analysis", route: "/eye-health-analysis" },
    },
    {
      icon: Sun,
      title: "Vitamin D",
      description: "Essential for bone health and immune function",
      tips: [
        "Spend 10-15 minutes in sunlight daily",
        "Consider supplements if you work indoors all day",
        "Take lunch breaks outside when possible",
        "Open blinds to let natural light in",
      ],
      color: "yellow",
      button: { text: "Set Reminders", route: "/vitamin-d-reminder" },
    },
    {
      icon: Coffee,
      title: "Physical Activity",
      description: "Movement and rest for better productivity",
      tips: [
        "Take a 5-minute break every 30 minutes",
        "Stand and stretch hourly",
        "Walk around during phone calls",
        "Do simple desk exercises",
      ],
      color: "green",
      button: { text: "Set Breaks", route: "/activity-reminder" },
    },
    {
      icon: Heart,
      title: "Social Connection & Well-being",
      description: "Maintain your psychological health",
      tips: [
        "Practice deep breathing exercises",
        "Maintain work-life boundaries",
        "Stay connected with colleagues",
        "Take proper lunch breaks away from your desk",
      ],
      color: "purple",
      button: { text: "Explore More", route: "/social-wellbeing" },
    },
    {
      icon: Droplet,
      title: "Hydration",
      description: "Stay properly hydrated throughout your workday",
      tips: [
        "Drink water regularly, not just when thirsty",
        "Keep a water bottle at your desk",
        "Set reminders to drink water every 2 hours",
        "Monitor your urine color for hydration levels",
      ],
      color: "cyan",
      button: { text: "Set Reminders", route: "/hydration-reminder" },
    },
  ];

  const colorClasses = {
    blue: "from-sky-500 to-sky-600",
    yellow: "from-yellow-500 to-yellow-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    cyan: "from-cyan-500 to-cyan-600",
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-sky-50 py-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-gradient-to-br from-orange-200/30 to-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-br from-sky-200/30 to-purple-200/30 rounded-full blur-3xl" />
      </div>

      {/* Back Button */}
      <div className="max-w-6xl mx-auto mb-6 relative z-10">
        <button
          onClick={() => navigate("/healthy")}
          className="inline-flex items-center gap-2 bg-white/30 backdrop-blur-md hover:bg-white/40 text-slate-700 font-medium px-4 py-2 rounded-lg border border-white/30 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <ArrowLeft size={16} />
          Back to Health Options
        </button>
      </div>

      {/* Header */}
      <header className="max-w-6xl mx-auto text-center mb-12 relative z-10">
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="bg-green-600 p-3 rounded-2xl shadow-md">
            <Users className="text-white" size={30} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-800">
            Healthy You
          </h1>
        </div>
        <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Essential health tips and practices for office workers and remote
          professionals. Take care of your body and mind while working.
        </p>
        <div className="mt-6">
          <button
            onClick={() => navigate("/health-info")}
            className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-medium px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Info size={20} />
            Official Health Guidelines
            <ArrowRight size={16} />
          </button>
        </div>
      </header>

      {/* Cards Grid */}
      <main className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {healthTips.map(({ icon: Icon, title, description, tips, color, button }) => (
            <div
              key={title}
              className="group flex flex-col bg-white/20 backdrop-blur-md rounded-3xl shadow-lg border border-white/30 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Header */}
              <div className={`bg-gradient-to-r ${colorClasses[color]} p-6 text-white`}>
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Icon size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold">{title}</h2>
                    <p className="text-white/90 text-sm mt-1">{description}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-between p-6">
                <div className="space-y-3 mb-6">
                  {tips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                      <p className="text-slate-700 text-sm leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>

                {/* Button */}
                <div className="flex justify-end mt-auto">
                  <button
                    onClick={() => navigate(button.route)}
                    className={`inline-flex items-center gap-2 bg-gradient-to-r ${colorClasses[color]} text-white font-medium px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg hover:scale-105`}
                  >
                    {button.text}
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Animated Assistant */}
      <AnimatedAssistant
        open={assistantOpen}
        name="Personal Health Assistant"
        position="bottom-right"
        accent="sky"
        steps={[
          { text: "👋 Welcome to your personal health guide!" },
          { text: "I’ll help you maintain healthy habits while working remotely or in-office." },
          { text: "Explore eye health, vitamin D, activity breaks, hydration, and connection tips below." },
          { text: "Remember: consistency is key to feeling your best! 💪" },
        ]}
        onClose={() => setAssistantOpen(false)}
        onFinish={() => setAssistantOpen(false)}
        width={380}
        typingSpeed={25}
      />
    </div>
  );
};

export default HealthyYou;
