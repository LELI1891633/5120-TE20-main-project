import React from "react";
import { Heart, Shield, Info, ExternalLink } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-orange-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-sky-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Data Sources and Disclaimer */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Info className="text-sky-400" size={20} />
              <h3 className="text-lg font-semibold">Data Sources & Disclaimer</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              We use open-source health data, ergonomic guidelines, and predictive analysis to provide 
              workspace recommendations. Accuracy may vary by source and update frequency. 
              Our assessments are for guidance purposes only.
            </p>
          </div>

          {/* Privacy and Permissions */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="text-sky-400" size={20} />
              <h3 className="text-lg font-semibold">Privacy & Permissions</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Your health data is processed locally and anonymously. No personal information is stored 
              or transmitted. All assessments are based on your input and general health guidelines.
            </p>
          </div>

          {/* Health Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Heart className="text-sky-400" size={20} />
              <h3 className="text-lg font-semibold">Health Information</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Our recommendations are based on established ergonomic principles and workplace health 
              standards. Always consult healthcare professionals for medical concerns.
            </p>
          </div>
        </div>

        {/* Official Resources */}
        <div className="mt-8 pt-8 border-t border-slate-700">
          <h4 className="text-md font-semibold mb-4">Official Health Resources</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <a
              href="https://www.safeworkaustralia.gov.au/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-300 hover:text-sky-400 transition-colors duration-200 text-sm"
            >
              <ExternalLink size={14} />
              Safe Work Australia
            </a>
            <a
              href="https://www.worksafe.vic.gov.au/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-300 hover:text-sky-400 transition-colors duration-200 text-sm"
            >
              <ExternalLink size={14} />
              WorkSafe Victoria
            </a>
            <a
              href="https://www.health.gov.au/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-300 hover:text-sky-400 transition-colors duration-200 text-sm"
            >
              <ExternalLink size={14} />
              Australian Government Health
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-slate-700 text-center">
          <p className="text-slate-400 text-sm">
            © 2025 OfficeEz. All recommendations are for informational purposes only. 
            Consult healthcare professionals for medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
