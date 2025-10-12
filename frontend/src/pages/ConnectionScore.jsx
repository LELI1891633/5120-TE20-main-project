import React, { useState, useEffect } from "react";
import { ArrowLeft, Sparkles, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function ConnectionScore({ onBack }) {
  const [step, setStep] = useState("privacy");
  const [score, setScore] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showPrivacy, setShowPrivacy] = useState(true);
  const navigate = useNavigate();

  const questions = [
    "I regularly talk to my coworkers outside of meetings.",
    "I feel supported by my friends and family.",
    "I engage in social or community activities weekly.",
    "I can express my feelings openly to someone I trust.",
    "I enjoy spending time with others in group settings.",
    "I make an effort to check in with colleagues regularly.",
    "I have at least one person I can rely on emotionally.",
    "I often celebrate small achievements with others.",
    "I feel like I belong to a community or group.",
    "I reach out to someone when I feel low or stressed.",
    "I enjoy casual conversations with people I meet.",
    "I prefer working or studying with others when possible.",
    "I often share my thoughts or opinions in discussions.",
    "I am comfortable asking for help from others.",
    "I feel connected to the people around me.",
  ];

  const handleAnswer = (value) => {
    const updatedAnswers = [...answers, value];
    setAnswers(updatedAnswers);

    if (updatedAnswers.length < questions.length) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      const total = updatedAnswers.reduce((a, b) => a + b, 0);
      const result = Math.round((total / (questions.length * 5)) * 100);
      setScore(result);
      setStep("result");
    }
  };

  const getFeedback = () => {
    if (score < 40)
      return [
        "Try reconnecting with a close friend this week.",
        "Start small—send a text or call someone you haven’t spoken to in a while.",
        "Join a casual activity group to meet like-minded people.",
      ];
    if (score < 70)
      return [
        "You’re doing well! Keep nurturing your existing relationships.",
        "Plan a coffee catch-up or join an interest group.",
        "Engage in more conversations at work or study.",
      ];
    return [
      "You have a strong connection network—amazing!",
      "Keep balancing your social and personal time.",
      "Support others by encouraging meaningful conversations.",
    ];
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-6 flex items-center justify-center overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 left-1/3 h-72 w-72 rounded-full bg-indigo-200 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/3 h-72 w-72 rounded-full bg-sky-200 blur-3xl animate-pulse" />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-3xl rounded-3xl border border-white/40 bg-white/50 p-8 shadow-2xl backdrop-blur-md">
        {/* Back Button */}
        <button
          onClick={() => (step === "quiz" ? onBack() : setStep("quiz"))}
          className="mb-6 inline-flex items-center gap-2 rounded-lg bg-white/40 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-white/60 transition"
        >
          <ArrowLeft size={16} />
          {step === "quiz" ? "Back" : "Back to Quiz"}
        </button>

        <div className="flex items-center justify-center mb-6">
          <Sparkles className="text-indigo-600 mr-2" />
          <h2 className="text-3xl font-bold text-slate-800">
            Connection Score Calculator
          </h2>
        </div>

        {/* QUIZ */}
        {step === "quiz" && (
          <>
            <p className="text-center text-gray-700 mb-8">
              Answer the following short quiz to find your connection level.
            </p>

            <div className="text-center mb-8">
              <p className="text-sm font-medium text-slate-600">
                Question {currentQuestion + 1} of {questions.length}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow p-6 text-center">
              <p className="font-medium mb-6 text-slate-800 text-lg">
                {questions[currentQuestion]}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {["Never", "Rarely", "Sometimes", "Often", "Always"].map(
                  (label, idx) => {
                    const value = idx + 1;
                    return (
                      <button
                        key={label}
                        onClick={() => handleAnswer(value)}
                        className="rounded-xl px-3 py-2 text-sm font-medium border bg-white hover:bg-indigo-50 hover:border-indigo-400 text-slate-700 transition-all"
                      >
                        {label}
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          </>
        )}

        {/* RESULT */}
        {step === "result" && (
          <div className="text-center space-y-8 animate-fadeIn">
            {/* Score Display */}
            <div className="relative inline-block">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-sky-200 via-indigo-300 to-fuchsia-200 blur-2xl opacity-70 animate-pulse" />
              <div className="relative z-10 flex flex-col items-center justify-center rounded-full h-40 w-40 mx-auto bg-gradient-to-br from-indigo-600 to-sky-500 shadow-xl text-white font-bold">
                <div className="text-5xl sm:text-6xl">{score}</div>
                <p className="text-sm font-medium mt-1 text-indigo-100">
                  Out of 100
                </p>
              </div>
            </div>

            {/* Personalized Micro Actions */}
            <div className="max-w-xl mx-auto bg-white/60 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg p-6">
              <h4 className="font-semibold text-sky-700 mb-3 text-lg">
                Personalized Micro-Actions 💬
              </h4>
              <ul className="text-gray-700 space-y-2 text-base leading-relaxed">
                {getFeedback().map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-left">
                    <span className="text-sky-600 font-bold">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
              <button
                onClick={() => {
                  setStep("quiz");
                  setAnswers([]);
                  setCurrentQuestion(0);
                  setScore(null);
                }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-600 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.03] transition-all"
              >
                Restart Quiz
              </button>
              <button
                onClick={() => navigate("/health-info")}
                className="px-6 py-3 rounded-xl border border-indigo-400 text-indigo-600 font-semibold bg-white hover:bg-indigo-50 hover:scale-[1.03] transition-all"
              >
                View Insights →
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-6 italic">
              Your data is not stored or shared — this result is for your reflection only.
            </p>
          </div>
        )}
      </div>

      {/* Privacy Popup */}
      {showPrivacy && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-fadeIn">
            <div className="flex justify-center mb-4">
              <Shield className="text-indigo-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-slate-800">
              Privacy Notice
            </h3>
            <p className="text-gray-600 mb-6">
              Your responses are completely private. No data is stored,
              tracked, or shared. Everything happens locally in your browser.
            </p>
            <button
              onClick={() => {
                setShowPrivacy(false);
                setStep("quiz");
              }}
              className="px-5 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}