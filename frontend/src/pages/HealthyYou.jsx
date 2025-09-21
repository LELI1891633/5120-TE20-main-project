import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Info, 
  Eye, 
  Sun, 
  Coffee, 
  Timer, 
  Heart,
  ArrowRight,
  CheckCircle,
  Users,
  Lightbulb,
  ArrowLeft
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
        "Position your screen arm's length away"
      ],
      color: "blue"
    },
    {
      icon: Sun,
      title: "Vitamin D",
      description: "Essential for bone health and immune function",
      tips: [
        "Spend 10-15 minutes in sunlight daily",
        "Consider supplements if you work indoors all day",
        "Take lunch breaks outside when possible",
        "Open blinds to let natural light in"
      ],
      color: "yellow"
    },
    {
      icon: Coffee,
      title: "Physical Activity Breaks",
      description: "Movement and rest for better productivity",
      tips: [
        "Take a 5-minute break every 30 minutes",
        "Stand and stretch hourly",
        "Walk around during phone calls",
        "Do simple desk exercises"
      ],
      color: "green"
    },
    {
      icon: Heart,
      title: "Mental Wellness",
      description: "Maintain your psychological health",
      tips: [
        "Practice deep breathing exercises",
        "Maintain work-life boundaries",
        "Stay connected with colleagues",
        "Take proper lunch breaks away from your desk"
      ],
      color: "purple"
    }
  ];

  const colorClasses = {
    blue: "from-sky-500 to-sky-600 bg-sky-50 border-sky-200 text-sky-800",
    yellow: "from-yellow-500 to-yellow-600 bg-yellow-50 border-yellow-200 text-yellow-800",
    green: "from-green-500 to-green-600 bg-green-50 border-green-200 text-green-800",
    purple: "from-purple-500 to-purple-600 bg-purple-50 border-purple-200 text-purple-800"
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-sky-50 py-6 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-gradient-to-br from-orange-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-br from-sky-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
      </div>
      {/* Back Button */}
      <div className="max-w-6xl mx-auto mb-4 relative z-10">
        <button
          onClick={() => navigate("/healthy")}
          className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-slate-700 font-medium px-4 py-2 rounded-lg border border-white/30 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <ArrowLeft size={16} />
          Back to Health Options
        </button>
      </div>

      {/* Header */}
      <header className="max-w-6xl mx-auto mb-12">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-green-600 p-3 rounded-2xl">
              <Users className="text-white" size={32} />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800">Healthy You</h1>
          </div>
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Essential health tips and practices for office workers and remote professionals. 
            Take care of your body and mind while working.
          </p>
          
          {/* Quick Info Button */}
          <div className="mt-6">
            <button
              onClick={() => navigate("/health-info")}
              className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-medium px-6 py-3 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <Info size={20} />
              Official Health Guidelines
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Health Tips Grid */}
      <main className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {healthTips.map(({ icon: Icon, title, description, tips, color }, index) => (
            <div 
              key={title}
              className="relative bg-white/20 backdrop-blur-md rounded-3xl shadow-xl border border-white/30 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/30"
            >
              {/* Card Header */}
              <div className={`bg-gradient-to-r ${colorClasses[color].split(' ')[0]} ${colorClasses[color].split(' ')[1]} p-6 text-white`}>
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Icon size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{title}</h2>
                    <p className="text-white/90 mt-1">{description}</p>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 relative">
                <div className="space-y-3">
                  {tips.map((tip, tipIndex) => (
                    <div key={tipIndex} className="flex items-start gap-3">
                      <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                      <p className="text-slate-700 text-sm leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
                
                {/* Action Buttons */}
                <div className="mt-6 flex justify-end gap-3">
                  {title === "Eye Health" && (
                    <button
                      onClick={() => navigate("/eye-health-analysis")}
                      className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                    >
                      Start Analysis
                      <ArrowRight size={16} />
                    </button>
                  )}
                  
                  {title === "Vitamin D" && (
                    <button
                      onClick={() => navigate("/vitamin-d-reminder")}
                      className="inline-flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                    >
                      Set Reminders
                      <ArrowRight size={16} />
                    </button>
                  )}
                  {title === "Physical Activity Breaks" && (
                    <button
                      onClick={() => navigate("/activity-reminder")}
                      className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                    >
                      Set Breaks
                      <ArrowRight size={16} />
                    </button>
                  )}

                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Resources */}
        <section className="mt-16">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 sm:p-12 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Lightbulb className="text-sky-600" size={32} />
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Need More Guidance?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              For comprehensive workplace health standards and official guidelines, 
              visit our health information section with trusted government resources.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/health-info")}
                className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-medium px-8 py-4 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                <Info size={20} />
                Official Guidelines
                <ArrowRight size={16} />
              </button>
              
              <button
                onClick={() => navigate("/healthy-desk")}
                className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-8 py-4 rounded-xl border border-slate-200 transition-colors duration-200"
              >
                <Timer size={20} />
                Assess Your Workspace
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Animated Assistant */}
      <AnimatedAssistant
        open={assistantOpen}
        name="Personal Health Assistant"
        position="bottom-right"
        accent="sky"
        steps={[
          { text: "Welcome to your personal health guide! 💚" },
          { text: "I'll help you maintain healthy habits while working." },
          { text: "Check out the tips below for eye health, vitamin D, and breaks!" },
          { text: "Remember: small changes make a big difference! 🌟" }
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
