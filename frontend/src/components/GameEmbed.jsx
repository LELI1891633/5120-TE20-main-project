import { useEffect, useRef, useState } from "react";
import { Maximize2, RotateCcw, AlertCircle } from "lucide-react";

export default function GameEmbed({ src, title, ratio = "56.25%" /* 16:9 */, height = 600 }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    // If not loaded within 12 seconds, treat as failed (adjustable as needed)
    const t = setTimeout(() => { if (!loaded) setFailed(true); }, 12000);
    return () => clearTimeout(t);
  }, [loaded]);

  return (
    <div className="rounded-xl sm:rounded-2xl border bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-2 sm:px-4 py-2 sm:py-3 border-b">
        <h2 className="text-sm sm:text-base font-semibold truncate pr-2">{title || "Game"}</h2>
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <button
            onClick={() => iframeRef.current?.requestFullscreen?.()}
            className="inline-flex items-center gap-1 rounded-lg border px-1 sm:px-2 py-1 text-xs sm:text-sm hover:bg-slate-50"
            title="Fullscreen"
          >
            <Maximize2 size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Fullscreen</span>
          </button>
          <button
            onClick={() => {
              setLoaded(false); setFailed(false);
              if (iframeRef.current) {
                // Force refresh by resetting src
                const u = new URL(iframeRef.current.src);
                u.searchParams.set("_", String(Date.now()));
                iframeRef.current.src = u.toString();
              }
            }}
            className="inline-flex items-center gap-1 rounded-lg border px-1 sm:px-2 py-1 text-xs sm:text-sm hover:bg-slate-50"
            title="Reload"
          >
            <RotateCcw size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Reload</span>
          </button>
        </div>
      </div>

      <div className="relative w-full" style={{ paddingTop: ratio, minHeight: height }}>
        {!loaded && !failed && (
          <div className="absolute inset-0 grid place-items-center bg-slate-50">
            <div className="w-64 sm:w-72 px-4">
              <div className="h-2 w-full bg-slate-200 rounded overflow-hidden">
                <div className="h-2 w-1/3 animate-pulse bg-slate-400 rounded" />
              </div>
              <p className="mt-3 text-xs sm:text-sm text-slate-600 text-center">Loading game…</p>
            </div>
          </div>
        )}

        {failed && (
          <div className="absolute inset-0 grid place-items-center bg-slate-50 p-4 sm:p-6 text-center">
            <div className="max-w-sm px-4">
              <div className="mx-auto mb-2 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-rose-100 text-rose-700 grid place-items-center">
                <AlertCircle size={16} className="sm:w-4 sm:h-4" />
              </div>
              <p className="text-xs sm:text-sm text-slate-700">
                Failed to load. The source may block iframes. Try reloading or self-hosting.
              </p>
            </div>
          </div>
        )}

        {/* Ad overlay - covers the left side where ads appear */}
        {loaded && !failed && (
          <div className="absolute left-0 top-0 w-1/3 sm:w-1/4 md:w-1/3 lg:w-1/4 h-full bg-gradient-to-r from-sky-50 to-blue-50 border-r border-sky-200 z-10">
            <div className="p-2 sm:p-3 md:p-4 h-full flex flex-col justify-center">
              <div className="text-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-2 sm:mb-3 bg-sky-100 rounded-full flex items-center justify-center">
                  <span className="text-sky-600 text-sm sm:text-base md:text-xl">🎮</span>
                </div>
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-sky-800 mb-1 sm:mb-2">How to Play</h3>
                <div className="text-xs sm:text-sm text-sky-700 space-y-1 sm:space-y-2 text-left">
                  <p className="leading-tight">• <strong>Select</strong> brush size (dots/squares)</p>
                  <p className="leading-tight">• <strong>Choose</strong> materials from the grid</p>
                  <p className="leading-tight">• <strong>Draw</strong> on the canvas to create</p>
                  <p className="leading-tight">• Try <strong>Sand + Water</strong> combinations</p>
                  <p className="leading-tight">• Plant <strong>Seeds</strong> to grow flowers</p>
                  <p className="leading-tight">• Use <strong>Wind</strong> to move particles</p>
                </div>
                <div className="mt-2 sm:mt-4 text-xs text-sky-600">
                  <p>💡 Tip: Mix different materials to see interesting physics!</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          title={title || "Game"}
          src={src}
          className="absolute inset-0 h-full w-full"
          frameBorder="0"
          allow="fullscreen; autoplay; gamepad; xr-spatial-tracking"
          scrolling="no"
          onLoad={() => setLoaded(true)}
        />
      </div>
    </div>
  );
}
