// src/components/AnimatedAssistant.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronRight, Info, Minimize2 } from "lucide-react";

const ACCENT_MAP = {
  indigo: "from-indigo-500 to-purple-500",
  emerald: "from-emerald-500 to-teal-500",
  pink: "from-pink-500 to-rose-500",
  amber: "from-amber-500 to-orange-500",
  sky: "from-sky-500 to-cyan-500",
};

function useTypewriter(text, speed = 22) {
  const [out, setOut] = useState("");
  useEffect(() => {
    setOut("");
    if (!text) return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, Math.max(8, speed));
    return () => clearInterval(id);
  }, [text, speed]);
  return { out, done: out.length === (text?.length ?? 0) };
}

function CartoonAvatar({ accent = "indigo", size = 64 }) {
  // size in px; defaults to 64
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 120 120" style={{ width: size, height: size }} className="drop-shadow">
        <circle cx="60" cy="60" r="56" fill="currentColor" opacity="0.15" className="text-gray-400" />
        <circle cx="60" cy="60" r="48" fill="currentColor" opacity="0.2" className="text-gray-500" />
        <circle cx="60" cy="60" r="40" fill="currentColor" opacity="0.25" className="text-gray-600" />
        <circle cx="60" cy="60" r="34" fill="#fff" />
        <circle cx="46" cy="56" r="4" fill="#111827" />
        <circle cx="74" cy="56" r="4" fill="#111827" />
        <path d="M42 72 C 52 84, 68 84, 78 72" fill="none" stroke="#111827" strokeWidth="5" strokeLinecap="round" />
      </svg>
      <motion.div
        className="absolute -right-1 -top-1 h-3 w-3 rounded-full"
        style={{
          backgroundColor:
            accent === "sky" ? "#0ea5e9" :
            accent === "indigo" ? "#6366f1" :
            accent === "emerald" ? "#10b981" :
            accent === "pink" ? "#ec4899" : "#f59e0b",
        }}
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      />
    </div>
  );
}

function Bubble({ children, accent = "indigo", width = 360 }) {
  return (
    <div className="relative max-w-[calc(100vw-2rem)] sm:max-w-none" style={{ maxWidth: width }}>
      <div className="absolute -left-3 top-6 h-0 w-0 border-y-8 border-y-transparent border-r-8 border-r-white" />
      <div className="rounded-2xl bg-white p-3 shadow-xl ring-1 ring-black/5 sm:p-4">{children}</div>
      <div className={`mt-2 h-1 rounded-full bg-gradient-to-r ${ACCENT_MAP[accent]}`} />
    </div>
  );
}

export function AnimatedAssistant({
  open = true,
  name = "OfficeEz Assistant",
  steps = [{ text: "Hi! I'm your OfficeEz assistant. Let me help you get started! 🎉" }],
  initialStep = 0,
  position = "bottom-right",
  accent = "sky",
  showMinimize = true,
  onClose,
  onStepChange,
  onFinish,
  width = 360,
  typingSpeed = 22,
  loop = false,
}) {
  // Persist collapsed across pages
  const [collapsed, setCollapsed] = useState(() => {
    try { return JSON.parse(localStorage.getItem("assistantCollapsed") ?? "false"); }
    catch { return false; }
  });
  const [visible, setVisible] = useState(() => !!open);

  const [step, setStep] = useState(initialStep);
  const current = steps[Math.min(step, steps.length - 1)];
  const { out, done } = useTypewriter(current?.text ?? "", typingSpeed);

  const rootRef = useRef(null);

  //useEffect(() => setVisible(open && !collapsed), [open, collapsed]);
  useEffect(() => localStorage.setItem("assistantCollapsed", JSON.stringify(collapsed)), [collapsed]);
  useEffect(() => { onStepChange?.(step); }, [step, onStepChange]);

  // click outside + Esc collapse
  useEffect(() => {
    if (!visible) return;
    const outside = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setCollapsed(true);
    };
    const esc = (e) => { if (e.key === "Escape") setCollapsed(true); };
    document.addEventListener("mousedown", outside);
    document.addEventListener("touchstart", outside);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", outside);
      document.removeEventListener("touchstart", outside);
      document.removeEventListener("keydown", esc);
    };
  }, [visible]);

  const posClass = useMemo(() => {
    const base = "fixed z-50 p-3";
    switch (position) {
      case "bottom-left": return `${base} left-4 bottom-4`;
      case "top-right":   return `${base} right-4 top-4`;
      case "top-left":    return `${base} left-4 top-4`;
      default:            return `${base} right-4 bottom-4`;
    }
  }, [position]);

  const next = () => {
  if (step < steps.length - 1) setStep((s) => s + 1);
  else if (loop) setStep(0);
  else {
    onFinish?.();
    setCollapsed(true);
  }
};

const prev = () => {
  if (step > 0) setStep((s) => s - 1);
};

useEffect(() => {
  if (visible && !collapsed) setStep(0);
}, [visible, collapsed]);


  const collapse = () => { setCollapsed(true); setVisible(false); onClose?.(); };
  const expand = () => { setCollapsed(false); setVisible(true); };

  // 🔔 Allow other components to open or update the assistant dynamically
useEffect(() => {
  const openHandler = (event) => {
    const { steps: newSteps, name: newName } = event.detail || {};
    if (newSteps) setStep(0);
    if (newName) document.title = `${newName} - OfficeEz`; // optional
    setCollapsed(false);
    setVisible(true);
  };
  window.addEventListener("open-assistant", openHandler);
  return () => window.removeEventListener("open-assistant", openHandler);
}, []);



  return (
    <>
      {/* Collapsed: show the same CartoonAvatar as a floating button */}
      <AnimatePresence>
        {collapsed && (
          <motion.button
            key="assistant-fab"
            className={`${posClass} inline-flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-xl ring-1 ring-black/5`}
            onClick={expand}
            aria-label="Open assistant"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            whileHover={{ scale: 1.03 }}
            style={{ padding: 8 }}
          >
            <CartoonAvatar accent={accent} size={56} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expanded assistant */}
      <AnimatePresence>
        {visible && !collapsed && (
          <motion.div
            key="assistant"
            ref={rootRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.18 }}
            className={posClass}
            role="dialog"
            aria-label={`${name} assistant`}
          >
            <div className="flex items-start gap-3">
              <CartoonAvatar accent={accent} />
              <Bubble accent={accent} width={width}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                    <Info
                      className="h-4 w-4"
                      style={{
                        color:
                          accent === "sky" ? "#0ea5e9" :
                          accent === "indigo" ? "#6366f1" :
                          accent === "emerald" ? "#10b981" :
                          accent === "pink" ? "#ec4899" : "#f59e0b",
                      }}
                    />
                    <span>{name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {showMinimize && (
                      <button
                        type="button"
                        className="rounded-md p-1 hover:bg-gray-100"
                        aria-label="Minimize"
                        onClick={collapse}
                      >
                        <Minimize2 className="h-4 w-4 text-gray-600" />
                      </button>
                    )}
                    <button
                      type="button"
                      className="rounded-md p-1 hover:bg-gray-100"
                      aria-label="Close"
                      onClick={collapse}   // close = collapse
                    >
                      <X className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                <p className="leading-relaxed text-gray-800" aria-live="polite">
                  {out}
                  {!done && <span className="ml-0.5 inline-block h-5 w-2 animate-pulse bg-gray-300 align-middle" />}
                </p>

                <div className="mt-3 flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Step {step + 1} / {steps.length}
                </div>

                <div className="flex gap-2">
                  {step > 0 && (
                    <button
                      onClick={prev}
                      className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 shadow-sm transition-all"
                    >
                      ← Prev
                    </button>
                  )}
                  <button
                    onClick={next}
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm text-white shadow hover:opacity-95 bg-gradient-to-r ${ACCENT_MAP[accent]} transition-all`}
                  >
                    {step < steps.length - 1 ? "Next" : loop ? "Restart" : "Finish"}
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              </Bubble>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
