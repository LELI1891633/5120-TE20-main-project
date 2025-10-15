import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Home, Heart, Info, Gamepad2, Calendar } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navItems = [
    { to: "/", label: "Home", icon: Home },
    { to: "/healthy", label: "Healthy Space", icon: Heart },
    { to: "/health-info", label: "Health Info", icon: Info },
    { to: "/stress-buster", label: "Stress Buster Game", icon: Gamepad2 },
    { to: "/planner", label: "Planner", icon: Calendar },
  ];

  return (
    <>
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 w-full z-[1000] bg-gradient-to-br from-sky-600 to-sky-800 shadow-lg backdrop-blur-md border-b border-white/10">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-300/30 to-pink-300/30 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-white/20 to-sky-300/30 rounded-full blur-2xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              to="/"
              className="text-xl font-bold text-yellow-300 hover:text-yellow-200 transition"
            >
              OfficeEz
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-4">
              {navItems.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-white hover:text-yellow-300 hover:bg-sky-700 transition-all duration-200"
                >
                  <Icon size={16} /> {label}
                </Link>
              ))}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="p-3 text-white hover:bg-sky-700 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500 transition"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-16" />

      {isMenuOpen && (
        <div className="fixed inset-0 z-[2000]">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Slide-in Menu Panel */}
          <div className="absolute top-0 right-0 w-4/5 max-w-xs h-full bg-slate-800 shadow-2xl z-[2001] animate-slide-right">
            <div className="flex items-center justify-between px-4 py-4 bg-sky-700 border-b border-white/10">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-lg font-semibold text-yellow-300"
              >
                OfficeEz
              </Link>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-md text-white hover:bg-sky-600"
              >
                <X size={22} />
              </button>
            </div>

            {/* Menu Items */}
            <div className="px-4 pt-3 space-y-2">
              {navItems.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium text-white hover:bg-sky-600 hover:text-yellow-300 transition-all duration-200"
                >
                  <Icon size={20} /> {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-right {
          from {
            transform: translateX(100%);
            opacity: 0.5;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-right {
          animation: slide-right 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
}
