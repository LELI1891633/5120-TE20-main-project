import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Heart,
  Shield,
  Zap,
  Activity,
  Eye,
  Droplets,
  Sun,
  Gamepad2,
  Info,
  ArrowRight,
} from "lucide-react";
import { AnimatedAssistant } from "../components/AnimatedAssistant";

export default function LandingPage() {
  const navigate = useNavigate();
  const [assistantOpen, setAssistantOpen] = useState(false);

  const areas = [
    { icon: Heart, label: "Workspace Health" },
    { icon: Shield, label: "Mental Wellness" },
    { icon: Zap, label: "Social Wellbeing" },
    { icon: Activity, label: "Productivity" },
    { icon: Eye, label: "Physical Activity" },
  ];

  const solutions = [
    {
      to: "/activity-reminder",
      label: "Activity Reminder",
      icon: Activity,
      color: "from-emerald-50 to-green-50",
      iconColor: "text-emerald-700",
    },
    {
      to: "/eye-health-analysis",
      label: "Eye Health Analysis",
      icon: Eye,
      color: "from-sky-50 to-indigo-50",
      iconColor: "text-sky-700",
    },
    {
      to: "/hydration-reminder",
      label: "Hydration Reminder",
      icon: Droplets,
      color: "from-cyan-50 to-teal-50",
      iconColor: "text-cyan-700",
    },
    {
      to: "/vitamin-d-reminder",
      label: "Vitamin D Reminder",
      icon: Sun,
      color: "from-amber-50 to-yellow-50",
      iconColor: "text-amber-600",
    },
    {
      to: "/stress-buster",
      label: "Stress Buster",
      icon: Gamepad2,
      color: "from-pink-50 to-rose-50",
      iconColor: "text-pink-600",
    },
    {
      to: "/social-wellbeing",
      label: "Social Wellbeing",
      icon: Heart,
      color: "from-violet-50 to-purple-50",
      iconColor: "text-violet-700",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-100 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col lg:flex-row items-center gap-10">
          {/* Left */}
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
              Improving wellbeing through{" "}
              <span className="text-sky-600">digitally-enabled care</span> for
              every workplace.
            </h1>
            <p className="text-lg text-slate-600 max-w-lg">
              OfficeEz empowers teams to build healthier habits with AI-powered
              reminders, ergonomic assessments, and real-time wellbeing tools.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => navigate("/healthy")}
                className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition"
              >
                Get Started
              </button>
            </div>
          </div>

          {/* Right visual */}
          <div className="flex-1 relative">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="rounded-3xl shadow-2xl border border-white/40"
            >
              <source src="/videos/workspace.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      {/* Areas We Support */}
      <section className="py-16 bg-gradient-to-b from-white to-slate-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-10">
            Areas We Support
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {areas.map(({ icon: Icon, label }, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center gap-3 bg-white border border-slate-200 hover:border-sky-300 rounded-2xl px-8 py-6 shadow-sm hover:shadow-md transition-all duration-300 min-w-[180px]"
              >
                <Icon className="text-sky-600" size={26} />
                <p className="font-medium text-slate-700">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions We Offer */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-10">
            Solutions We Offer
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {solutions.map(({ to, label, icon: Icon, color, iconColor }) => (
              <Link
                key={to}
                to={to}
                className="group bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all p-6 flex flex-col items-center text-center"
              >
                <div
                  className={`inline-flex items-center justify-center bg-gradient-to-br ${color} p-3 rounded-xl mb-3`}
                >
                  <Icon className={iconColor} size={22} />
                </div>
                <p className="font-medium text-slate-700 group-hover:text-sky-700">
                  {label}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Assistant */}
      <AnimatedAssistant
        open={assistantOpen}
        name="OfficeEz Assistant"
        accent="sky"
        position="bottom-right"
        steps={[
          { text: "Hi there 👋, welcome to OfficeEz!" },
          { text: "Explore our wellbeing features to create a healthier workspace." },
          { text: "Click ‘Get Started’ to begin your journey." },
        ]}
        onClose={() => setAssistantOpen(false)}
        width={360}
        typingSpeed={25}
      />
    </div>
  );
}
