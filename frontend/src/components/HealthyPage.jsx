import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Monitor, User, ArrowRight, ArrowLeft } from "lucide-react";
import { AnimatedAssistant } from "../components/AnimatedAssistant";

const HealthyPage = () => {
  const navigate = useNavigate();
  const [assistantOpen, setAssistantOpen] = useState(true);

  const healthyOptions = [
    {
      id: "healthy-desk",
      title: "Healthy Desk",
      description: "Optimize your workspace setup for better posture and productivity",
      icon: Monitor,
      route: "/healthy-desk",
      gradient: "from-sky-500 to-sky-700",
      features: ["Ergonomic assessment", "Posture guidance", "Equipment recommendations"]
    },
    {
      id: "healthy-you",
      title: "Healthy You",
      description: "Personal health tips for office workers and remote professionals",
      icon: User,
      route: "/healthy-you",
      gradient: "from-green-500 to-green-700",
      features: ["Eye health tips", "Break reminders", "Vitamin D guidance"]
    }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-sky-50 py-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-orange-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-sky-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
      </div>
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <div className="mb-6 relative z-10">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-slate-700 font-medium px-4 py-2 rounded-lg border border-white/30 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
        </div>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
            Choose Your Health Journey
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Select the area you'd like to focus on to get personalized recommendations 
            for a healthier work environment.
          </p>
        </div>

        {/* Additional Info */}
        <div className="mb-12 text-center relative z-10">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/30 max-w-2xl mx-auto hover:bg-white/30 transition-all duration-300">
            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              Need guidance?
            </h3>
            <p className="text-slate-600 mb-4">
              Not sure where to start? Our assistant can help guide you through 
              the best options for your specific needs.
            </p>
            <p className="text-sm text-slate-500">
              💡 Look for the assistant button in the bottom-left corner for helpful tips!
            </p>
          </div>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto relative z-10">
          {healthyOptions.map(({ id, title, description, icon: Icon, route, gradient, features }) => (
            <div 
              key={id}
              className="group relative bg-white/20 backdrop-blur-md rounded-3xl shadow-xl border border-white/30 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/30"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
              
              {/* Content */}
              <div className="relative p-8 sm:p-10">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl shadow-lg mb-6`}>
                  <Icon className="text-white" size={32} />
                </div>

                {/* Title & Description */}
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">
                  {title}
                </h2>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {description}
                </p>

                {/* Features List */}
                <ul className="space-y-2 mb-8">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 text-sm text-slate-600">
                      <div className={`w-2 h-2 bg-gradient-to-r ${gradient} rounded-full`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => navigate(route)}
                  className={`w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r ${gradient} text-white font-semibold py-4 px-6 rounded-xl hover:shadow-lg transition-all duration-300 group-hover:scale-105 border border-white/20 shadow-md`}
                >
                  Get Started
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Animated Assistant */}
      <AnimatedAssistant
        open={assistantOpen}
        name="Health Guide Assistant"
        position="bottom-right"
        accent="sky"
        steps={[
          { text: "Welcome to your health journey! 🏥" },
          { text: "I can help you choose between workspace setup and personal health tips." },
          { text: "Click on either 'Healthy Desk' or 'Healthy You' to get started!" },
          { text: "Need more guidance? I'm here to help! 💪" }
        ]}
        onClose={() => setAssistantOpen(false)}
        onFinish={() => setAssistantOpen(false)}
        width={380}
        typingSpeed={25}
      />
    </div>
  );
};

export default HealthyPage;