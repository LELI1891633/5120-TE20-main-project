import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import HealthyPage from "./pages/HealthyPage";
import HealthyDesk from "./pages/HealthyDesk";
import HealthyYou from "./pages/HealthyYou";
import HealthInfo from "./pages/HealthInfo";
import EyeHealthAnalysis from "./pages/EyeHealthAnalysis";
import VitaminDReminder from "./pages/VitaminDReminder";
import ActivityReminder from "./pages/ActivityReminder";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/healthy" element={<HealthyPage />} />
            <Route path="/healthy-desk" element={<HealthyDesk />} />
            <Route path="/healthy-you" element={<HealthyYou />} />
            <Route path="/health-info" element={<HealthInfo />} />
            <Route path="/eye-health-analysis" element={<EyeHealthAnalysis />} />
            <Route path="/vitamin-d-reminder" element={<VitaminDReminder />} />
            <Route path="/activity-reminder" element={<ActivityReminder />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
