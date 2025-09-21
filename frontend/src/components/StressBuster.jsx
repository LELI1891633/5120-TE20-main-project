import { Flower2, Info } from "lucide-react";
import GameEmbed from "./GameEmbed";

export default function StressBuster() {
  return (
    <div className="bg-gradient-to-br from-sky-50 to-blue-50 min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Header */}
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-2xl bg-sky-100 p-2">
            <Flower2 className="text-sky-700" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Stress-buster</h1>
            <p className="text-sm text-slate-600">A calm sandbox you can play instantly—no login, no data entry.</p>
          </div>
        </div>


        {/* Game */}
        <GameEmbed
          title="Sandspiel (sandbox)"
          src="https://sandspiel.club/"
          height={600}
          ratio="56.25%"  // 16:9
        />
      </div>
    </div>
  );
}
