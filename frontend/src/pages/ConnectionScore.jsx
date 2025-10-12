import React from "react";
import { ArrowLeft } from "lucide-react";

export default function ConnectionScore({ onBack }) {
  return (
    <div className="rounded-3xl border border-white/30 bg-white/20 p-8 shadow-xl backdrop-blur-md text-center">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-white/30 transition-all"
      >
        <ArrowLeft size={16} />
        Back
      </button>
      <h2 className="text-2xl font-bold text-slate-800 mb-4">
        Connection Score Calculator
      </h2>
      <p className="text-gray-600 mb-6">
        This upcoming feature will include a short quiz to calculate your
        workplace connection score and provide helpful recommendations.
      </p>
      <div className="bg-white rounded-2xl shadow p-6 max-w-md mx-auto">
        <p className="text-slate-700">Feature coming soon...</p>
      </div>
    </div>
  );
}