import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Sun, 
  Clock, 
  Bell, 
  CheckCircle, 
  ArrowLeft,
  Timer,
  Pause,
  Play,
  AlertTriangle
} from "lucide-react";
import { AnimatedAssistant } from "../components/AnimatedAssistant";

const VitaminDReminder = () => {
  const navigate = useNavigate();
  const [assistantOpen, setAssistantOpen] = useState(true);
  const [showReminder, setShowReminder] = useState(false);
  const [timerHours, setTimerHours] = useState(1);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerAlert, setTimerAlert] = useState(false);
  const [showTimerCard, setShowTimerCard] = useState(false);

  // Handle reminder click
  const handleReminderClick = () => {
    setShowReminder(true);
    setShowTimerCard(true);
    // Auto-hide reminder after 3 seconds
    setTimeout(() => {
      setShowReminder(false);
    }, 3000);
  };

  // Timer related functions
  const startTimer = () => {
    if (timeLeft === 0) {
      setTimeLeft(timerHours * 3600); // Convert hours to seconds
    }
    setIsTimerRunning(true);
    setTimerAlert(false);
    console.log(`Timer started: ${timeLeft || timerHours * 3600} seconds`);
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
    console.log(`Timer paused: ${timeLeft} seconds remaining`);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(0);
    setTimerAlert(false);
    console.log('Timer reset');
  };

  // Timer countdown effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsTimerRunning(false);
            setTimerAlert(true);
            // Show notification when timer completes
            if (Notification.permission === 'granted') {
              new Notification('Vitamin D Time!', {
                body: 'Time to step outside for some natural Vitamin D! ☀️',
                icon: '/vite.svg'
              });
            }
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else if (!isTimerRunning && timeLeft !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Save timer state to localStorage whenever it changes
  useEffect(() => {
    const timerState = {
      timeLeft,
      isTimerRunning,
      timerHours,
      timerAlert,
      startTime: isTimerRunning ? Date.now() : null,
      lastSaved: Date.now()
    };
    localStorage.setItem('vitaminDTimer', JSON.stringify(timerState));
  }, [timeLeft, isTimerRunning, timerHours, timerAlert]);

  // Restore timer state from localStorage on component mount
  useEffect(() => {
    const savedTimer = localStorage.getItem('vitaminDTimer');
    if (savedTimer) {
      try {
        const timerState = JSON.parse(savedTimer);
        setTimerHours(timerState.timerHours || 1);
        setTimerAlert(timerState.timerAlert || false);
        
        if (timerState.isTimerRunning && timerState.startTime) {
          // Calculate elapsed time since the timer was started
          const elapsed = Math.floor((Date.now() - timerState.startTime) / 1000);
          const remaining = Math.max(0, timerState.timeLeft - elapsed);
          
          if (remaining > 0) {
            // Timer is still running, restore the remaining time
            setTimeLeft(remaining);
            setIsTimerRunning(true);
            console.log(`Timer restored: ${remaining} seconds remaining`);
          } else {
            // Timer has completed while away
            setTimeLeft(0);
            setIsTimerRunning(false);
            setTimerAlert(true);
            console.log('Timer completed while away');
          }
        } else {
          // Timer was not running, just restore the time left
          setTimeLeft(timerState.timeLeft || 0);
          setIsTimerRunning(false);
          console.log('Timer state restored (not running)');
        }
      } catch (error) {
        console.error('Error loading timer state:', error);
        // Reset to default values if there's an error
        setTimeLeft(0);
        setIsTimerRunning(false);
        setTimerAlert(false);
        setTimerHours(1);
      }
    }
  }, []);

  // Save state before page unload and component unmount
  useEffect(() => {
    const handleBeforeUnload = () => {
      const timerState = {
        timeLeft,
        isTimerRunning,
        timerHours,
        timerAlert,
        startTime: isTimerRunning ? Date.now() : null,
        lastSaved: Date.now()
      };
      localStorage.setItem('vitaminDTimer', JSON.stringify(timerState));
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is being hidden, save state
        const timerState = {
          timeLeft,
          isTimerRunning,
          timerHours,
          timerAlert,
          startTime: isTimerRunning ? Date.now() : null,
          lastSaved: Date.now()
        };
        localStorage.setItem('vitaminDTimer', JSON.stringify(timerState));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      // Save state on component unmount
      const timerState = {
        timeLeft,
        isTimerRunning,
        timerHours,
        timerAlert,
        startTime: isTimerRunning ? Date.now() : null,
        lastSaved: Date.now()
      };
      localStorage.setItem('vitaminDTimer', JSON.stringify(timerState));
    };
    }, [timeLeft, isTimerRunning, timerHours, timerAlert]);

  // Format time display
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };


  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        .timer-slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #eab308;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .timer-slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #eab308;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .timer-slider:disabled::-webkit-slider-thumb {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .timer-slider:disabled::-moz-range-thumb {
          background: #9ca3af;
          cursor: not-allowed;
        }
      `}</style>
    <div className="relative min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 py-6 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-1/3 w-80 h-80 bg-gradient-to-br from-yellow-200/30 to-orange-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-amber-200/30 to-yellow-200/30 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8 relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/healthy-you')}
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-slate-700 font-medium px-4 py-2 rounded-lg border border-white/30 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <ArrowLeft size={16} />
            Back to Health Tips
          </button>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 rounded-2xl">
              <Sun className="text-white" size={32} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">Vitamin D Reminder</h1>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Get natural Vitamin D with smart reminders to step outside during your workday
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Vitamin D Reminder Card */}
        <div className="bg-white/20 backdrop-blur-md rounded-3xl shadow-xl border border-white/30 p-8">
          <div className="flex items-center gap-3 mb-6">
            <Sun className="text-yellow-600" size={24} />
            <h2 className="text-2xl font-bold text-slate-800">Vitamin D Reminder</h2>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-slate-700 mb-2">Time to step outside for fresh air! 🌿</p>
                <button
                  onClick={handleReminderClick}
                  className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  <Sun className="w-4 h-4" />
                  Get Vitamin D Reminder
                </button>
              </div>
            </div>
          </div>

          {/* Reminder Message */}
          {showReminder && (
            <div className="mt-4 p-4 bg-green-100 border border-green-200 rounded-lg fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-green-600 w-5 h-5" />
                <span className="text-green-800 font-medium">
                  Great! Step outside for 10-15 minutes to get natural Vitamin D! ☀️
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Timer Section - Only show after clicking reminder */}
        {showTimerCard && (
          <div className="bg-white/20 backdrop-blur-md rounded-3xl shadow-xl border border-white/30 p-8 fade-in">
          <div className="flex items-center gap-3 mb-6">
            <Timer className="text-orange-600" size={24} />
            <h2 className="text-2xl font-bold text-slate-800">Outdoor Time Timer</h2>
          </div>
          
          <div className="text-center">
            <div className="text-6xl font-mono font-bold text-slate-800 mb-4">
              {formatTime(timeLeft)}
            </div>
            
            <div className="flex justify-center gap-4 mb-6">
              {!isTimerRunning ? (
                <button
                  onClick={startTimer}
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  <Play size={20} />
                  Start Timer
                </button>
              ) : (
                <button
                  onClick={pauseTimer}
                  className="inline-flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium px-6 py-3 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  <Pause size={20} />
                  Pause
                </button>
              )}
              
              <button
                onClick={resetTimer}
                className="inline-flex items-center gap-2 bg-slate-600 hover:bg-slate-700 text-white font-medium px-6 py-3 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Reset
              </button>
            </div>

            {/* Timer Slider */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Set reminder time (hours)
              </label>
              <div className="bg-white rounded-lg p-3 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">1 hr</span>
                  <span className="text-lg font-semibold text-yellow-600">
                    {timerHours} {timerHours === 1 ? 'hr' : 'hrs'}
                  </span>
                  <span className="text-sm text-slate-600">10 hrs</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={timerHours}
                  onChange={(e) => setTimerHours(parseInt(e.target.value))}
                  disabled={isTimerRunning}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer timer-slider"
                  style={{
                    background: `linear-gradient(to right, #eab308 0%, #eab308 ${((timerHours - 1) / 9) * 100}%, #e2e8f0 ${((timerHours - 1) / 9) * 100}%, #e2e8f0 100%)`
                  }}
                />
              </div>
            </div>

            {/* Timer Alert */}
            {timerAlert && (
              <div className="mt-4 p-4 bg-red-100 border border-red-200 rounded-lg fade-in">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="text-red-600 w-5 h-5" />
                  <span className="text-red-800 font-medium">
                    Time's up! Time to get some Vitamin D! ☀️
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        )}


      </div>

      {/* Animated Assistant */}
      <AnimatedAssistant
        open={assistantOpen}
        name="Vitamin D Assistant"
        position="bottom-right"
        accent="amber"
        steps={[
          { text: "Welcome to your Vitamin D reminder system! ☀️" },
          { text: "I'll help you get natural Vitamin D through smart reminders." },
          { text: "🌅 Best time for Vitamin D: 10 AM - 3 PM" },
          { text: "☀️ 10-15 minutes of sun exposure is usually enough" },
          { text: "🏢 Find a sunny spot near windows or go outside" },
          { text: "🧴 Don't forget sunscreen for longer exposure" },
          { text: "📱 Use the timer to track your outdoor time" },
          { text: "🔄 Set regular reminders throughout your workday" },
          { text: "Let's keep you healthy and energized! 💪" }
        ]}
        onClose={() => setAssistantOpen(false)}
      />
    </div>
    </>
  );
};

export default VitaminDReminder;
