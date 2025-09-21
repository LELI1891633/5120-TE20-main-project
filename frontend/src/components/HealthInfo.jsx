import React from "react";
import { useNavigate } from "react-router-dom";
import { ExternalLink, ArrowLeft } from "lucide-react";

const HealthInfo = () => {
  const navigate = useNavigate();
  
  return (
    <div className="relative min-h-screen p-6 sm:p-8 bg-gradient-to-br from-orange-50 via-pink-50 to-sky-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/3 left-0 w-72 h-72 bg-gradient-to-br from-orange-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-gradient-to-br from-sky-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
      </div>
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-slate-700 font-medium px-4 py-2 rounded-lg border border-white/30 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center">Health Information</h1>
        <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-lg border border-white/30 p-8 hover:bg-white/30 transition-all duration-300">
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            Here you'll find workstation standards, eye health, and Vitamin D info from trusted government resources.
          </p>
          <div className="space-y-4">
            <a
              href="https://www.safeworkaustralia.gov.au/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300 group"
            >
              <ExternalLink className="text-blue-600 group-hover:scale-110 transition-transform" size={20} />
              <span className="text-gray-800 font-medium">Safe Work Australia</span>
            </a>
            <a
              href="https://www.worksafe.vic.gov.au/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300 group"
            >
              <ExternalLink className="text-blue-600 group-hover:scale-110 transition-transform" size={20} />
              <span className="text-gray-800 font-medium">WorkSafe Victoria</span>
            </a>
            <a
              href="https://www.health.gov.au/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300 group"
            >
              <ExternalLink className="text-blue-600 group-hover:scale-110 transition-transform" size={20} />
              <span className="text-gray-800 font-medium">Australian Government Health</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthInfo;
