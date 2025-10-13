import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Monitor, User, ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedAssistant } from "../components/AnimatedAssistant";

export default function HealthyPage() {
  const navigate = useNavigate();
  const [assistantOpen, setAssistantOpen] = useState(true);

  const healthyOptions = [
    {
      id: "healthy-desk",
      title: "Healthy Desk",
      description:
        "Improve your workspace for better posture, comfort, and productivity.",
      icon: Monitor,
      route: "/healthy-desk",
      gradient: "from-sky-500 to-sky-600",
      features: [
        "Ergonomic assessment",
        "Posture guidance",
        "Desk setup tips",
      ],
    },
    {
      id: "healthy-you",
      title: "Healthy You",
      description:
        "Discover personal health strategies for office and remote workers.",
      icon: User,
      route: "/healthy-you",
      gradient: "from-green-500 to-green-600",
      features: [
        "Eye care reminders",
        "Stretch breaks",
        "Vitamin D balance",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-sky-50 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-6xl px-4 py-8 mt-4">
        {/* Back Button */}
              <div className="max-w-6xl mx-auto mb-6 relative z-10">
                <button
                  onClick={() => navigate("/")}
                  className="inline-flex items-center gap-2 bg-white/30 backdrop-blur-md hover:bg-white/40 text-slate-700 font-medium px-4 py-2 rounded-lg border border-white/30 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <ArrowLeft size={16} />
                  Back to Home
                </button>
              </div>

        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold text-slate-800 tracking-tight">
            Choose Your Health Journey
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Explore your personalized wellbeing paths designed to help you
            achieve balance, focus, and vitality at work.
          </p>
        </div>
      </div>

      {/* Options Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full px-6 pb-20">
        {healthyOptions.map(({ id, title, description, icon: Icon, route, gradient, features }) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-3xl shadow-md hover:shadow-lg transition-all duration-300 border border-slate-100 focus-within:ring-2 focus-within:ring-sky-400"
          >
            <div className="p-8 flex flex-col h-full justify-between">
              <div>
                <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl mb-4 shadow-sm`}>
                  <Icon className="text-white" size={26} />
                </div>

                <h2 className="text-2xl font-semibold text-slate-800 mb-2">
                  {title}
                </h2>
                <p className="text-slate-600 mb-4">{description}</p>

                <ul className="space-y-2 text-slate-500 text-sm">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full bg-gradient-to-r ${gradient}`}
                      />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => navigate(route)}
                className={`mt-6 inline-flex items-center justify-center gap-2 bg-gradient-to-r ${gradient} text-white font-medium py-3 px-6 rounded-lg hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-400 transition-all`}
              >
                Explore
                <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mb-12 text-center relative z-10">
        <div className="bg-white/40 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/30 max-w-2xl mx-auto transition-all duration-300">
          <h3 className="text-xl font-semibold text-slate-800 mb-3">
            Need guidance?
          </h3>
          <p className="text-slate-600 mb-5">
            Not sure where to start? Click below and our assistant will guide you through 
            the best options for your specific needs.
          </p>
          <button
  onClick={() =>
    window.dispatchEvent(
      new CustomEvent("open-assistant", {
        detail: {
          name: "Health Guide Assistant",
          steps: [
            { text: "👋 Hi there! Ready to start your wellness journey?" },
            { text: "You can choose between workspace setup or personal wellbeing." },
            { text: "Click any option above and explore more tailored ideas!" },
          ],
        },
      })
    )
  }
  className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300"
>
  💬 Ask the Assistant
</button>

        </div>
      </div>

      {/* Assistant */}
      <AnimatedAssistant
        open={assistantOpen}
        name="Health Guide Assistant"
        position="bottom-right"
        accent="sky"
        steps={[
          { text: "👋 Hi there! Ready to start your wellness journey?" },
          { text: "You can choose between workspace setup or personal wellbeing." },
          { text: "Click any option above and explore more tailored ideas!" },
        ]}
        onClose={() => setAssistantOpen(false)}
        width={360}
        typingSpeed={25}
      />
    </div>
  );
}
