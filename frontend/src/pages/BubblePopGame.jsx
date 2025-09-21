// src/pages/BubblePopGame.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Info, Gamepad2 } from "lucide-react";

export default function BubblePopGame() {
  const navigate = useNavigate();
  const COLS = 7;
  const size = COLS * COLS; 
  const BUBBLE = 56;  

  const [popped, setPopped] = useState(() => Array(size).fill(false));
  const reset = () => setPopped(Array(size).fill(false));
  const pop = (i) =>
    setPopped((arr) => (arr[i] ? arr : ((arr = arr.slice()), (arr[i] = true), arr)));

  const poppedCount = popped.filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-sky-50">
      <header className="mx-auto max-w-5xl px-4 pt-4 pb-3 flex items-center justify-between">
        <button
          onClick={() => navigate("/stress-buster")}
          className="inline-flex items-center gap-2 rounded-lg border border-white/40 bg-white/30 px-3 py-2 text-slate-700 shadow-sm backdrop-blur-md hover:bg-white/50"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <button
          onClick={() => navigate("/health-info")}
          className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-3 py-2 text-white shadow-md hover:bg-sky-700"
        >
          <Info size={16} /> <span className="hidden sm:inline">Health Info</span>
        </button>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl bg-cyan-100 p-2"><Gamepad2 className="text-cyan-600" size={20} /></div>
          <h1 className="text-2xl font-semibold">Bubble Pop</h1>
        </div>

        <div className="rounded-3xl border border-white/40 bg-white/70 p-6 shadow-xl backdrop-blur-md overflow-x-auto">
+          <div
            className="grid gap-3 w-fit mx-auto"             
            style={{ gridTemplateColumns: `repeat(${COLS}, ${BUBBLE}px)` }}          >
            {popped.map((isPopped, i) => (
              <button
                key={i}
                onClick={() => pop(i)}
                style={{ width: BUBBLE, height: BUBBLE }} 
                className={`rounded-full transition-all ${
                  isPopped
                    ? "scale-95 bg-slate-200"
                    : "bg-gradient-to-br from-cyan-200 to-sky-200 hover:from-cyan-300 hover:to-sky-300"
                }`}
                aria-label={isPopped ? "Popped" : "Pop bubble"}
              />
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
            <span>Popped: {poppedCount} / {size}</span>
            <button onClick={reset} className="rounded-lg bg-slate-100 px-3 py-1 ring-1 ring-slate-200 hover:bg-slate-200">
              Reset
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
