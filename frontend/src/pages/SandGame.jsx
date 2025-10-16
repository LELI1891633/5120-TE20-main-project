// src/pages/SandGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, Flower2, Palette } from "lucide-react";

export default function SandGame() {
  const navigate = useNavigate();
  return <ParticleTrailGame />;
}

function ParticleTrailGame() {
  const canvasRef = useRef(null);
  const [particles, setParticles] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [currentColor, setCurrentColor] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const animationRef = useRef(null);

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43'
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      if (!isActive) return;
      
      // Fade out the canvas slightly to create trail effect
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      setParticles(prevParticles => {
        return prevParticles.map(particle => {
          const newParticle = {
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            life: particle.life - 1,
            size: particle.size * 0.98
          };

          // Draw particle
          ctx.beginPath();
          ctx.arc(newParticle.x, newParticle.y, newParticle.size, 0, Math.PI * 2);
          ctx.fillStyle = newParticle.color;
          ctx.globalAlpha = newParticle.life / 60;
          ctx.fill();
          ctx.globalAlpha = 1;

          return newParticle;
        }).filter(particle => particle.life > 0 && particle.size > 0.1);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    if (isActive) {
      animate();
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive]);

  const createParticle = (x, y) => {
    const newParticle = {
      id: Date.now() + Math.random(),
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      size: Math.random() * 8 + 3,
      life: 60,
      color: colors[currentColor]
    };
    
    setParticles(prev => [...prev, newParticle]);
  };

  const handleMouseMove = (e) => {
    if (!isActive) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Check if mouse is actually over the canvas
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Only create particles if mouse is within canvas bounds
    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      setMousePos({ x, y });
      
      // Create particles along the mouse trail
      if (Math.random() < 0.7) {
        createParticle(x + (Math.random() - 0.5) * 20, y + (Math.random() - 0.5) * 20);
      }
    }
  };

  const handleMouseClick = (e) => {
    if (!isActive) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Only create particles if click is within canvas bounds
    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      // Create burst of particles
      for (let i = 0; i < 10; i++) {
        createParticle(x, y);
      }
    }
  };

  // Touch support for mobile
  const handleTouchMove = (e) => {
    if (!isActive) return;
    const touch = e.touches[0];
    if (!touch) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      setMousePos({ x, y });
      if (Math.random() < 0.9) {
        createParticle(x + (Math.random() - 0.5) * 20, y + (Math.random() - 0.5) * 20);
      }
    }
  };
  const handleTouchStart = (e) => { setIsActive(true); handleTouchMove(e); };
  const handleTouchEnd = () => { setIsActive(false); };

  const clearParticles = () => {
    setParticles([]);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const changeColor = () => {
    setCurrentColor((prev) => (prev + 1) % colors.length);
  };

  const startGame = () => {
    setIsActive(true);
  };

  const stopGame = () => {
    setIsActive(false);
  };

  return (
    <div className="bg-gradient-to-br from-sky-50 to-blue-50 min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                console.log("Back button clicked, navigating to /stress-buster");
                try {
                  navigate("/stress-buster");
                } catch (error) {
                  console.error("Navigation error:", error);
                  // Fallback to browser back
                  window.history.back();
                }
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-white/60 px-3 py-2 text-slate-700 shadow-sm hover:bg-white/80 transition-colors z-10 relative"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <div className="rounded-2xl bg-sky-100 p-2">
              <Flower2 className="text-sky-700" size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">Particle Trail Relaxation</h1>
              <p className="text-sm text-slate-600">
                Move your mouse to create colorful particle trails. Click for bursts!
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm text-slate-600">Current Color</div>
              <div className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: colors[currentColor] }}
                ></div>
                <span className="text-sm font-medium text-slate-700">
                  {currentColor + 1}/{colors.length}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              {!isActive ? (
                <button
                  onClick={startGame}
                  className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white shadow-sm hover:bg-green-700 transition-colors"
                >
                  Start
                </button>
              ) : (
                <button
                  onClick={stopGame}
                  className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white shadow-sm hover:bg-red-700 transition-colors"
                >
                  Stop
                </button>
              )}
              <button
                onClick={changeColor}
                className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white shadow-sm hover:bg-purple-700 transition-colors"
              >
                <Palette size={16} />
                Color
              </button>
              <button
                onClick={clearParticles}
                className="inline-flex items-center gap-2 rounded-lg bg-white/60 px-4 py-2 text-slate-700 shadow-sm hover:bg-white/80 transition-colors"
              >
                <RefreshCw size={16} />
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-4 rounded-xl bg-white/60 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-700">
            <div className={`h-2 w-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="text-sm">
              {isActive 
                ? "Move your mouse around to create particle trails! Click for bursts of particles." 
                : "Click 'Start' to begin creating particle trails with your mouse movement"
              }
            </span>
          </div>
        </div>

        {/* Game Canvas */}
        <div className="rounded-2xl bg-white/60 shadow-xl overflow-hidden">
          <canvas
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onClick={handleMouseClick}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="w-full cursor-crosshair bg-gradient-to-b from-sky-100 to-blue-100 touch-none block h-[50vh] min-h-[300px] max-h-[520px]"
          />
        </div>

        {/* Game Info */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl bg-white/60 p-4 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-2">How to Play</h3>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Move your mouse to create trails</li>
              <li>• Click for particle bursts</li>
              <li>• Change colors anytime</li>
              <li>• Clear to start fresh</li>
            </ul>
          </div>
          <div className="rounded-xl bg-white/60 p-4 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-2">Relaxation Tips</h3>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Move slowly and smoothly</li>
              <li>• Focus on the flowing motion</li>
              <li>• Try different color combinations</li>
              <li>• Let your creativity flow</li>
            </ul>
          </div>
          <div className="rounded-xl bg-white/60 p-4 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-2">Benefits</h3>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Calming visual effects</li>
              <li>• Mindful movement practice</li>
              <li>• Creative expression</li>
              <li>• Stress relief through art</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
