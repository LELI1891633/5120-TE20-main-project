import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Droplet, Bell, Clock, ArrowLeft, CheckCircle, AlertTriangle } from "lucide-react";

const LS_KEY = "hydration.settings.v1";

function withinOfficeHours(date, startHour = 9, endHour = 17) {
  const h = date.getHours();
  return h >= startHour && h < endHour;
}

function isWeekday(d) {
  const n = d.getDay(); // 0=Sun … 6=Sat
  return n >= 1 && n <= 5;
}

function nextWorkStart(from, startHour, weekdaysOnly) {
  const d = new Date(from);
  d.setMinutes(0, 0, 0);
  d.setHours(startHour);
  if (from.getHours() >= startHour) d.setDate(d.getDate() + 1);
  if (weekdaysOnly) { 
    while (!isWeekday(d)) d.setDate(d.getDate() + 1); 
  }
  return d;
}

export default function HydrationReminder() {
  const navigate = useNavigate();
  const [enabled, setEnabled] = useState(false);
  const [intervalMins, setIntervalMins] = useState(120); // Default 2 hours
  const [officeStart, setOfficeStart] = useState(9);
  const [officeEnd, setOfficeEnd] = useState(17);
  const [useNotifications, setUseNotifications] = useState(false);
  const [weekdaysOnly, setWeekdaysOnly] = useState(true);
  const [customMessage, setCustomMessage] = useState("");
  const [nextAt, setNextAt] = useState(null);
  const [inputErrors, setInputErrors] = useState({});
  const timerRef = useRef(null);
  const bc = useRef(null);

  // Load settings - only run once on mount
  useEffect(() => {
    try {
      // Check if localStorage is available
      if (typeof Storage === "undefined") {
        console.error('❌ localStorage is not available');
        return;
      }
      
      const raw = localStorage.getItem(LS_KEY);
      
      if (raw) {
        const s = JSON.parse(raw);
        
        // Validate and sanitize loaded values
        const validatedInterval = validateInterval(s.intervalMins ?? 120);
        const validatedStart = validateHour(s.officeStart ?? 9);
        const validatedEnd = validateHour(s.officeEnd ?? 17);
        
        // Set all states at once to avoid race conditions
        setEnabled(!!s.enabled);
        setIntervalMins(validatedInterval);
        setOfficeStart(validatedStart);
        setOfficeEnd(validatedEnd);
        setUseNotifications(!!s.useNotifications);
        setWeekdaysOnly(s.weekdaysOnly ?? true);
        setCustomMessage(s.customMessage ?? "");
        setNextAt(s.nextAt ?? null);
        
        // Settings loaded successfully
      }
      
      // Mark as initialized after loading (or attempting to load)
      setIsInitialized(true);
    } catch (error) {
      console.error('❌ Error loading settings:', error);
      // Set safe defaults
      setIntervalMins(120);
      setOfficeStart(9);
      setOfficeEnd(17);
      setIsInitialized(true); // Still mark as initialized even if there was an error
    }
  }, []); // Empty dependency array - only run once

  // Save settings - but not on initial load
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    if (!isInitialized) return; // Don't save on initial load
    
    try {
      // Check if localStorage is available
      if (typeof Storage === "undefined") {
        console.error('❌ localStorage is not available for saving');
        return;
      }
      
      // Validate values before saving
      const validatedInterval = validateInterval(intervalMins);
      const validatedStart = validateHour(officeStart);
      const validatedEnd = validateHour(officeEnd);
      
      const s = { 
        enabled, 
        intervalMins: validatedInterval, 
        officeStart: validatedStart, 
        officeEnd: validatedEnd, 
        useNotifications, 
        weekdaysOnly, 
        customMessage, 
        nextAt 
      };
      localStorage.setItem(LS_KEY, JSON.stringify(s));
    } catch (error) {
      console.error('❌ Error saving settings:', error);
    }
  }, [enabled, intervalMins, officeStart, officeEnd, useNotifications, weekdaysOnly, customMessage, nextAt, isInitialized]);

  // Request notification permission (optional)
  useEffect(() => {
    if (useNotifications && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission().catch(() => {});
      }
    }
  }, [useNotifications]);

  // Schedule next reminder function
  const scheduleNext = useCallback(() => {
    if (!enabled) {
      setNextAt(null);
      return;
    }
    const now = new Date();
    // If not in office hours or not weekday (when weekdaysOnly is enabled), set next trigger to next start time
    if (!withinOfficeHours(now, officeStart, officeEnd) || (weekdaysOnly && !isWeekday(now))) {
      const aligned = nextWorkStart(now, officeStart, weekdaysOnly);
      setNextAt(aligned);
      return;
    }
    const next = new Date(now.getTime() + intervalMins * 60 * 1000);
    // If crosses office hours, postpone to next workday start
    if (!withinOfficeHours(next, officeStart, officeEnd) || (weekdaysOnly && !isWeekday(next))) {
      const aligned = nextWorkStart(now, officeStart, weekdaysOnly);
      setNextAt(aligned);
      return;
    }
    setNextAt(next);
  }, [enabled, intervalMins, officeStart, officeEnd, weekdaysOnly]);

  // Multi-tab synchronization
  useEffect(() => {
    if ("BroadcastChannel" in window) {
      bc.current = new BroadcastChannel("hydration");
      bc.current.onmessage = (e) => {
        if (e.data?.type === "sync-next") setNextAt(e.data.nextAt);
        if (e.data?.type === "sync-enabled") setEnabled(e.data.enabled);
      };
    }
    return () => {
      if (bc.current) {
        bc.current.close();
        bc.current = null;
      }
    };
  }, []);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (bc.current) {
        bc.current.close();
        bc.current = null;
      }
    };
  }, []);

  function broadcast(msg) { 
    bc.current?.postMessage(msg); 
  }

  useEffect(() => { 
    broadcast({ type: "sync-enabled", enabled }); 
  }, [enabled]);
  
  useEffect(() => { 
    if (nextAt) broadcast({ type: "sync-next", nextAt }); 
  }, [nextAt]);

  // Trigger reminder (dispatch global event -> banner; and optional browser notification)
  const fireReminder = useCallback(() => {
    const message = customMessage.trim() || "Time for a glass of water, stay hydrated! 💧";
    const detail = {
      message: message,
      at: new Date().toISOString(),
    };
    window.dispatchEvent(new CustomEvent("hydration:notify", { detail }));

    // Optional: light vibration (mobile support)
    if (navigator.vibrate) navigator.vibrate(80);

    // Optional: play notification sound
    const audio = document.getElementById("hydration-ping");
    if (audio) { 
      audio.currentTime = 0; 
      audio.play().catch(() => {}); 
    }

    if (useNotifications && "Notification" in window && Notification.permission === "granted") {
      try {
        new Notification("Hydration Reminder", {
          body: message,
        });
      } catch {}
    }
  }, [customMessage, useNotifications]);

  // Timer loop - separate effects to avoid infinite loops
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (!enabled) return;

    // Schedule next immediately
    scheduleNext();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [enabled, scheduleNext]);

  // Restart timer if settings are loaded and enabled but timer is not running
  useEffect(() => {
    if (enabled && !timerRef.current && nextAt) {
      scheduleNext();
    }
  }, [enabled, nextAt, scheduleNext]);

  // Separate effect for the interval timer
  useEffect(() => {
    if (!enabled || !nextAt) return;

    timerRef.current = setInterval(() => {
      const now = new Date();
      if (now >= new Date(nextAt)) {
        // Time to fire reminder
        fireReminder();
        scheduleNext();
      }
    }, 30000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [enabled, nextAt, fireReminder, scheduleNext]);

  // Input validation functions
  const validateInterval = (value) => {
    const num = Number(value);
    if (isNaN(num) || num < 15 || num > 1440) { // 15 minutes to 24 hours
      return 120; // default to 2 hours
    }
    return Math.round(num / 15) * 15; // round to nearest 15 minutes
  };

  const validateHour = (value) => {
    const num = Number(value);
    if (isNaN(num) || num < 0 || num > 23) {
      return 9; // default to 9 AM
    }
    return Math.round(num);
  };

  const handleIntervalChange = (e) => {
    const value = e.target.value;
    if (value === '') {
      setIntervalMins(120);
      setInputErrors(prev => ({ ...prev, interval: null }));
      return;
    }
    const num = Number(value);
    if (isNaN(num) || num < 15 || num > 1440) {
      setInputErrors(prev => ({ ...prev, interval: 'Please enter a value between 15 and 1440 minutes' }));
      return;
    }
    const validated = validateInterval(value);
    setIntervalMins(validated);
    setInputErrors(prev => ({ ...prev, interval: null }));
  };

  const handleOfficeStartChange = (e) => {
    const value = e.target.value;
    if (value === '') {
      setOfficeStart(9);
      setInputErrors(prev => ({ ...prev, officeStart: null }));
      return;
    }
    const num = Number(value);
    if (isNaN(num) || num < 0 || num > 23) {
      setInputErrors(prev => ({ ...prev, officeStart: 'Please enter a value between 0 and 23' }));
      return;
    }
    const validated = validateHour(value);
    setOfficeStart(validated);
    setInputErrors(prev => ({ ...prev, officeStart: null }));
  };

  const handleOfficeEndChange = (e) => {
    const value = e.target.value;
    if (value === '') {
      setOfficeEnd(17);
      setInputErrors(prev => ({ ...prev, officeEnd: null }));
      return;
    }
    const num = Number(value);
    if (isNaN(num) || num < 0 || num > 23) {
      setInputErrors(prev => ({ ...prev, officeEnd: 'Please enter a value between 0 and 23' }));
      return;
    }
    const validated = validateHour(value);
    setOfficeEnd(validated);
    setInputErrors(prev => ({ ...prev, officeEnd: null }));
  };

  // Preset buttons (satisfy AC2: fixed intervals + office hours)
  const applyPreset = (mins, start = 9, end = 17) => {
    setIntervalMins(validateInterval(mins));
    setOfficeStart(validateHour(start));
    setOfficeEnd(validateHour(end));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50">
      <div className="mx-auto max-w-4xl px-4 py-6">
        <button
          onClick={() => {
            // Clean up any running timers before navigation
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            // Close broadcast channel
            if (bc.current) {
              bc.current.close();
              bc.current = null;
            }
            navigate("/healthy-you");
          }}
          className="mb-4 inline-flex items-center gap-2 text-sky-700 hover:text-sky-900"
        >
          <ArrowLeft size={18} /> Back to Healthy You
        </button>

        <div className="rounded-2xl border bg-white shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-xl bg-sky-100 p-2">
              <Droplet size={22} className="text-sky-700" />
            </div>
            <h1 className="text-2xl font-semibold">Hydration Reminder</h1>
          </div>
          

          <p className="text-slate-600 mb-6">
            Set up generic hydration reminders during office hours. When due, a banner will appear on the site with a short actionable message.
          </p>

          {/* Real-time Status Indicator */}
          <div className="bg-sky-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${enabled ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span className="font-medium">
                {enabled ? 'Reminders Active' : 'Reminders Paused'}
              </span>
              {nextAt && (
                <span className="text-sm text-slate-600">
                  Next: {new Date(nextAt).toLocaleTimeString()}
                </span>
              )}
            </div>
            {enabled && (
              <div className="mt-2 text-xs text-slate-500">
                {weekdaysOnly ? 'Weekdays only (Mon–Fri)' : 'All days'} • 
                Office hours: {officeStart}:00 – {officeEnd}:00 • 
                Interval: {intervalMins} minutes
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="rounded-xl border p-4">
              <label className="block text-sm font-medium mb-2">Interval (minutes)</label>
              <input
                type="number"
                min={15}
                max={1440}
                step={15}
                value={intervalMins}
                onChange={handleIntervalChange}
                className={`w-full rounded-lg border px-3 py-2 text-base sm:text-sm ${
                  inputErrors.interval ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                aria-describedby="interval-help"
                placeholder="120"
              />
              {/* Fixed height container to prevent layout shift */}
              <div className="mt-1 h-5 flex items-start">
                {inputErrors.interval ? (
                  <div className="flex items-center gap-1 text-xs text-red-600">
                    <AlertTriangle size={12} />
                    {inputErrors.interval}
                  </div>
                ) : (
                  <p id="interval-help" className="text-xs text-slate-500">15-1440 minutes (15 min to 24 hours), step 15 minutes</p>
                )}
              </div>
            </div>

            <div className="rounded-xl border p-4">
              <label className="block text-sm font-medium mb-2">Office hours</label>
              <div className="flex items-start gap-2">
                <div className="flex flex-col">
                  <input
                    type="number"
                    min={0}
                    max={23}
                    value={officeStart}
                    onChange={handleOfficeStartChange}
                    className={`w-20 rounded-lg border px-3 py-2 text-base sm:text-sm ${
                      inputErrors.officeStart ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    aria-label="Start hour"
                    placeholder="9"
                  />
                  {/* Fixed height container to prevent layout shift */}
                  <div className="mt-1 h-4 flex items-start">
                    {inputErrors.officeStart && (
                      <div className="flex items-center gap-1 text-xs text-red-600">
                        <AlertTriangle size={10} />
                        <span className="truncate">{inputErrors.officeStart}</span>
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-sm mt-2">to</span>
                <div className="flex flex-col">
                  <input
                    type="number"
                    min={0}
                    max={23}
                    value={officeEnd}
                    onChange={handleOfficeEndChange}
                    className={`w-20 rounded-lg border px-3 py-2 text-base sm:text-sm ${
                      inputErrors.officeEnd ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    aria-label="End hour"
                    placeholder="17"
                  />
                  {/* Fixed height container to prevent layout shift */}
                  <div className="mt-1 h-4 flex items-start">
                    {inputErrors.officeEnd && (
                      <div className="flex items-center gap-1 text-xs text-red-600">
                        <AlertTriangle size={10} />
                        <span className="truncate">{inputErrors.officeEnd}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* Fixed height container for help text */}
              <div className="mt-2 h-4 flex items-start">
                {!inputErrors.officeStart && !inputErrors.officeEnd && (
                  <p className="text-xs text-slate-500">0-23 hours (24-hour format). Example: 9 to 17 covers 9:00–17:00.</p>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border p-4 mb-6">
            <div className="mb-3 text-sm font-medium">Presets</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                className="flex flex-col items-center p-3 rounded-lg border hover:bg-slate-50 transition-colors"
                onClick={() => applyPreset(120, 9, 17)}
                aria-label="Set reminder every 2 hours during 9 AM to 5 PM"
              >
                <Clock size={20} className="mb-1" />
                <span className="text-sm font-medium">2 Hours</span>
                <span className="text-xs text-slate-500">9 AM – 5 PM</span>
              </button>
              <button
                className="flex flex-col items-center p-3 rounded-lg border hover:bg-slate-50 transition-colors"
                onClick={() => applyPreset(60, 9, 17)}
                aria-label="Set reminder every hour during 9 AM to 5 PM"
              >
                <Clock size={20} className="mb-1" />
                <span className="text-sm font-medium">Hourly</span>
                <span className="text-xs text-slate-500">9 AM – 5 PM</span>
              </button>
              <button
                className="flex flex-col items-center p-3 rounded-lg border hover:bg-slate-50 transition-colors"
                onClick={() => applyPreset(30, 13, 17)}
                aria-label="Set reminder every 30 minutes during 1 PM to 5 PM"
              >
                <Clock size={20} className="mb-1" />
                <span className="text-sm font-medium">30 Min</span>
                <span className="text-xs text-slate-500">1 PM – 5 PM</span>
              </button>
            </div>
          </div>

          {/* Custom Message Input */}
          <div className="rounded-xl border p-4 mb-6">
            <label htmlFor="custom-message" className="block text-sm font-medium mb-2">
              Custom Reminder Message
            </label>
            <input
              type="text"
              id="custom-message"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Time for a glass of water, stay hydrated! 💧"
              className="w-full rounded-lg border px-3 py-2 text-base sm:text-sm"
              aria-describedby="message-help"
            />
            <p id="message-help" className="mt-1 text-xs text-slate-500">
              Leave empty to use the default message. Use emojis to make it more engaging!
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="weekdays-only"
                checked={weekdaysOnly}
                onChange={(e) => setWeekdaysOnly(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="weekdays-only" className="text-sm text-slate-700 cursor-pointer">
                Weekdays only (Mon–Fri)
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="browser-notifications"
                checked={useNotifications}
                onChange={(e) => setUseNotifications(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="browser-notifications" className="text-sm text-slate-700 cursor-pointer inline-flex items-center gap-1">
                <Bell size={16} /> Also use browser notifications (optional)
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setEnabled((v) => !v)}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-white font-medium ${
                enabled ? "bg-rose-600 hover:bg-rose-700" : "bg-sky-600 hover:bg-sky-700"
              } transition-colors`}
            >
              {enabled ? (
                <>
                  Stop reminders
                </>
              ) : (
                <>
                  <CheckCircle size={18} /> Start reminders
                </>
              )}
            </button>

            {nextAt && (
              <div className="text-center sm:text-left">
                <span className="text-sm text-slate-600">
                  Next reminder: {new Date(nextAt).toLocaleTimeString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Hidden audio element for notification sound */}
      <audio id="hydration-ping" preload="auto" className="hidden">
        <source src="/sounds/ping.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}
