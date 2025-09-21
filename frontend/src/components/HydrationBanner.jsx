import React from "react";
import { X, Info } from "lucide-react";

export default function HydrationBanner({ open, message, onClose, variant = "banner", autoFocus = true, onSnooze }) {
  if (!open) return null;

  // Handle Esc key to close
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (variant === "banner") {
    return (
      <div className="fixed top-0 inset-x-0 z-[1000]" role="status" aria-live="polite" aria-label="Hydration reminder notification">
        <div className="mx-auto max-w-6xl">
          <div className="m-2 rounded-xl border border-sky-200 bg-sky-50 text-sky-900 shadow">
            <div className="flex items-center gap-3 p-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100" aria-hidden="true">
                <Info size={18} />
              </div>
              <div className="flex-1 text-sm font-medium" id="banner-message">
                {message || "Time for a glass of water, stay hydrated!"}
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1 hover:bg-sky-100 active:scale-95"
                aria-label="Close hydration reminder banner"
                aria-describedby="banner-message"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Modal mode
  return (
    <div 
      className="fixed inset-0 z-[1000] flex items-center justify-center"
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="hydration-title"
      aria-describedby="hydration-description"
      onKeyDown={(e) => {
        if (e.key !== "Tab") return;
        const root = e.currentTarget;
        const focusable = root.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); 
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); 
          first.focus();
        }
      }}
    >
      <div className="absolute inset-0 bg-black/30" onClick={onClose} aria-hidden="true" />
      <div className="relative mx-4 w-full max-w-md rounded-2xl border bg-white p-5 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-sky-100 p-2" aria-hidden="true">
            <Info size={18} className="text-sky-700" />
          </div>
          <div className="flex-1">
            <div id="hydration-title" className="text-base font-semibold mb-1">Hydration Reminder</div>
            <p id="hydration-description" className="text-sm text-slate-700">
              {message || "Time for a glass of water, stay hydrated!"}
            </p>
            <div className="mt-4 flex gap-2">
              <button 
                onClick={onClose}
                autoFocus={autoFocus}
                className="rounded-lg bg-sky-600 px-3 py-2 text-white hover:bg-sky-700"
                aria-describedby="hydration-description"
              >
                Got it
              </button>
              <button 
                onClick={onSnooze || onClose}
                className="rounded-lg border px-3 py-2 hover:bg-slate-50"
                aria-describedby="hydration-description"
              >
                Snooze 10 min
              </button>
            </div>
          </div>
          <button 
            onClick={onClose} 
            aria-label="Close hydration reminder dialog" 
            className="ml-2 rounded p-1 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
