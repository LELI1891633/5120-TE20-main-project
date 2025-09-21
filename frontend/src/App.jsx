import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./components/LandingPage";
import HealthyPage from "./components/HealthyPage";
import HealthyDesk from "./components/HealthyDesk";
import HealthyYou from "./components/HealthyYou";
import HealthInfo from "./components/HealthInfo";
import EyeHealthAnalysis from "./components/EyeHealthAnalysis";
import VitaminDReminder from "./components/VitaminDReminder";
import HydrationReminder from "./components/HydrationReminder";
import StressBuster from "./components/StressBuster";
import HydrationBanner from "./components/HydrationBanner";
import ActivityReminder from "./pages/ActivityReminder";

function App() {
  const [hydrationOpen, setHydrationOpen] = useState(false);
  const [hydrationMsg, setHydrationMsg] = useState("Time for a glass of water, stay hydrated!");
  const [snoozedUntil, setSnoozedUntil] = useState(null);

  useEffect(() => {
    const onNotify = (e) => {
      // If currently snoozed, ignore the notification
      if (snoozedUntil && new Date() < new Date(snoozedUntil)) return;
      
      const msg = e?.detail?.message || "Time for a glass of water, stay hydrated!";
      setHydrationMsg(msg);
      setHydrationOpen(true);
      // Auto close after 12 seconds (adjustable)
      const t = setTimeout(() => setHydrationOpen(false), 12000);
      return () => clearTimeout(t);
    };
    window.addEventListener("hydration:notify", onNotify);
    return () => window.removeEventListener("hydration:notify", onNotify);
  }, [snoozedUntil]);

  const handleSnooze = () => {
    const t = new Date();
    t.setMinutes(t.getMinutes() + 10);
    setSnoozedUntil(t.toISOString());
    setHydrationOpen(false);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <HydrationBanner
            open={hydrationOpen}
            message={hydrationMsg}
            onClose={() => setHydrationOpen(false)}
            variant="modal"
            onSnooze={handleSnooze}
          />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/healthy" element={<HealthyPage />} />
            <Route path="/healthy-desk" element={<HealthyDesk />} />
            <Route path="/healthy-you" element={<HealthyYou />} />
            <Route path="/health-info" element={<HealthInfo />} />
            <Route path="/eye-health-analysis" element={<EyeHealthAnalysis />} />
            <Route path="/vitamin-d-reminder" element={<VitaminDReminder />} />
            <Route path="/hydration-reminder" element={<HydrationReminder />} />
            <Route path="/stress-buster" element={<StressBuster />} />
            <Route path="/activity-reminder" element={<ActivityReminder />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
