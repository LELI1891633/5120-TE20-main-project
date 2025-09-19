import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Home, Heart, Info, Flower2 } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navItems = [
    { to: "/", label: "Home", icon: Home },
    { to: "/healthy", label: "Healthy Space", icon: Heart },
    { to: "/health-info", label: "Health Info", icon: Info },
    { to: "/stress-buster", label: "Stress-buster", icon: Flower2 },
  ];

  return (
    <nav className="relative bg-gradient-to-br from-sky-600 to-sky-800 shadow-lg overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-300/30 to-pink-300/30 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-white/20 to-sky-300/30 rounded-full blur-2xl"></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-white">OfficeEase</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium !text-white hover:!text-white hover:bg-sky-600 transition-all duration-200"
                >
                  <Icon size={16} className="!text-white" />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-700">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-white hover:text-white hover:bg-sky-600 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <Icon size={20} className="text-white" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
