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
    <div className="rounded-2xl border bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h2 className="text-base font-semibold">{title || "Game"}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => iframeRef.current?.requestFullscreen?.()}
            className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-sm hover:bg-slate-50"
            title="Fullscreen"
          >
            <Maximize2 size={16} /> Fullscreen
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
            className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-sm hover:bg-slate-50"
            title="Reload"
          >
            <RotateCcw size={16} /> Reload
          </button>
        </div>
      </div>

      <div className="relative w-full" style={{ paddingTop: ratio, minHeight: height }}>
        {!loaded && !failed && (
          <div className="absolute inset-0 grid place-items-center bg-slate-50">
            <div className="w-72">
              <div className="h-2 w-full bg-slate-200 rounded overflow-hidden">
                <div className="h-2 w-1/3 animate-pulse bg-slate-400 rounded" />
              </div>
              <p className="mt-3 text-sm text-slate-600 text-center">Loading game…</p>
            </div>
          </div>
        )}

        {failed && (
          <div className="absolute inset-0 grid place-items-center bg-slate-50 p-6 text-center">
            <div className="max-w-sm">
              <div className="mx-auto mb-2 h-10 w-10 rounded-full bg-rose-100 text-rose-700 grid place-items-center">
                <AlertCircle size={18} />
              </div>
              <p className="text-sm text-slate-700">
                Failed to load. The source may block iframes. Try reloading or self-hosting.
              </p>
            </div>
          </div>
        )}

        {/* Ad overlay - covers the left side where ads appear */}
        {loaded && !failed && (
          <div className="absolute left-0 top-0 w-1/4 h-full bg-gradient-to-r from-sky-50 to-blue-50 border-r border-sky-200 z-10">
            <div className="p-4 h-full flex flex-col justify-center">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-sky-100 rounded-full flex items-center justify-center">
                  <span className="text-sky-600 text-xl">🎮</span>
                </div>
                <h3 className="text-lg font-semibold text-sky-800 mb-2">How to Play</h3>
                <div className="text-sm text-sky-700 space-y-2 text-left">
                  <p>• <strong>Select</strong> brush size (dots/squares)</p>
                  <p>• <strong>Choose</strong> materials from the grid</p>
                  <p>• <strong>Draw</strong> on the canvas to create</p>
                  <p>• Try <strong>Sand + Water</strong> combinations</p>
                  <p>• Plant <strong>Seeds</strong> to grow flowers</p>
                  <p>• Use <strong>Wind</strong> to move particles</p>
                </div>
                <div className="mt-4 text-xs text-sky-600">
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
