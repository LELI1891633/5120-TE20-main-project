import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronDown, 
  Info, 
  RotateCcw, 
  CheckCircle, 
  AlertTriangle,
  Monitor,
  User,
  Eye,
  Coffee,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import { analyzeDeskSetup, calculateElbowHeight } from "../scripts/deskAnalyzer";
import AnalysisLoader from "./AnalysisLoader";
import { AnimatedAssistant } from "./AnimatedAssistant";


/* --------------------------------------------------------------------------
 * Initial form state
 * -------------------------------------------------------------------------- */
const initialForm = {
  heightCm: 165,
  screenDistanceCm: 60,
  monitorTopAtEye: "yes",
  keyboardAtElbow: "yes",
  feetSupported: "yes",
  chairLumbar: "yes",
  glare: "no",
  breakEveryMins: 30,
};

const HealthyDesk = () => {
  const navigate = useNavigate();

  /* ------------------------------------------------------------------------
   * UI state
   *  - form: live, local-only (no persistence)
   *  - showTips: collapsible "How to estimate" section
   *  - submitted: controls layout (form-only vs. form + results)
   *  - loading: controls analysis loading state
   *  - loadingStep: current step in analysis process
   *  - analysisResult: result from analysis script
   * ------------------------------------------------------------------------ */
  const [form, setForm] = useState(initialForm);
  const [showTips, setShowTips] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [assistantOpen, setAssistantOpen] = useState(true);

  /* ------------------------------------------------------------------------
   * Field helpers
   * ------------------------------------------------------------------------ */
  const onNumber = (name) => (e) =>
    setForm((f) => ({ ...f, [name]: Number(e.target.value) || 0 }));

  const onSelect = (name) => (e) =>
    setForm((f) => ({ ...f, [name]: e.target.value }));

  /* ------------------------------------------------------------------------
   * Derived elbow height (simple anthropometric estimate)
   * ------------------------------------------------------------------------ */
  const elbowHeight = useMemo(
    () => calculateElbowHeight(form.heightCm),
    [form.heightCm]
  );

  /* ------------------------------------------------------------------------
   * Handlers: submit & reset
   * ------------------------------------------------------------------------ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoadingStep(0);
    setSubmitted(false);
    setAnalysisResult(null);

    try {
      // Simulate step progression
      const stepInterval = setInterval(() => {
        setLoadingStep(prev => {
          if (prev < 2) return prev + 1;
          clearInterval(stepInterval);
          return prev;
        });
      }, 500);

      // Perform analysis
      const result = await analyzeDeskSetup(form);
      
      clearInterval(stepInterval);
      setAnalysisResult(result);
      setSubmitted(true);
    } catch (error) {
      console.error('Analysis failed:', error);
      // Handle error - could show error message
    } finally {
      setLoading(false);
      setLoadingStep(0);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setSubmitted(false);
    setLoading(false);
    setLoadingStep(0);
    setAnalysisResult(null);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-sky-50 py-6 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-gradient-to-br from-orange-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-gradient-to-br from-sky-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
      </div>
      {/* Back Button */}
      <div className="max-w-7xl mx-auto mb-4 relative z-10">
        <button
          onClick={() => navigate("/healthy")}
          className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-slate-700 font-medium px-4 py-2 rounded-lg border border-white/30 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <ArrowLeft size={16} />
          Back to Health Options
        </button>
      </div>

      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8">
        <div className="text-center sm:text-left">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="bg-sky-600 p-2 rounded-lg">
                <Monitor className="text-white" size={24} />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">Healthy Desk</h1>
            </div>
            <button
              onClick={() => setAssistantOpen(true)}
              className="flex items-center gap-2 bg-sky-100 hover:bg-sky-200 text-sky-700 px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <Info size={18} />
              <span className="hidden sm:inline">Get Help</span>
            </button>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl">
            Quick checklist to optimize your workstation setup for better health and productivity.
          </p>
        </div>
      </header>

      {/* Guidance Section */}
      <section className="max-w-7xl mx-auto mb-8">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors duration-200"
            onClick={() => setShowTips((v) => !v)}
            aria-expanded={showTips}
          >
            <div className="flex items-center gap-3">
              <Info className="text-sky-600" size={20} />
              <h2 className="text-xl font-semibold text-slate-800">How to estimate measurements</h2>
            </div>
            <ChevronDown 
              className={`text-slate-400 transition-transform duration-300 ${showTips ? "rotate-180" : ""}`} 
              size={20}
            />
          </button>

          {showTips && (
            <div className="px-6 pb-6 border-t border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <div className="flex gap-3">
                  <Monitor className="text-sky-600 mt-1 flex-shrink-0" size={16} />
                  <div>
                    <p className="font-medium text-slate-800">Screen distance</p>
                    <p className="text-sm text-slate-600">Arm's length (~50–75 cm)</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Eye className="text-green-600 mt-1 flex-shrink-0" size={16} />
                  <div>
                    <p className="font-medium text-slate-800">Monitor position</p>
                    <p className="text-sm text-slate-600">Top at eye level</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <User className="text-purple-600 mt-1 flex-shrink-0" size={16} />
                  <div>
                    <p className="font-medium text-slate-800">Keyboard height</p>
                    <p className="text-sm text-slate-600">Near elbow height (~{elbowHeight} cm for you)</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="text-orange-600 mt-1 flex-shrink-0" size={16} />
                  <div>
                    <p className="font-medium text-slate-800">Feet support</p>
                    <p className="text-sm text-slate-600">Flat on floor or footrest</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Eye className="text-yellow-600 mt-1 flex-shrink-0" size={16} />
                  <div>
                    <p className="font-medium text-slate-800">Lighting</p>
                    <p className="text-sm text-slate-600">Reduce glare with blinds</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Coffee className="text-red-600 mt-1 flex-shrink-0" size={16} />
                  <div>
                    <p className="font-medium text-slate-800">Breaks</p>
                    <p className="text-sm text-slate-600">Every 20–30 minutes</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>      {/* Main Content */}
      <main className={`max-w-7xl mx-auto ${(submitted && !loading) ? "grid grid-cols-1 xl:grid-cols-2 gap-8" : ""}`}>
        {/* Form */}
        <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg hover:bg-white/30 transition-all duration-300">
          <form onSubmit={handleSubmit} noValidate className="p-6 sm:p-8">
            <h3 className="text-xl font-semibold text-slate-800 mb-6">Assessment Form</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Your height (cm)
                </label>
                <input
                  type="number"
                  min="120"
                  max="220"
                  value={form.heightCm}
                  onChange={onNumber("heightCm")}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                  aria-label="Your height in centimeters"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Screen distance (cm)
                </label>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={form.screenDistanceCm}
                  onChange={onNumber("screenDistanceCm")}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                  aria-label="Screen distance in centimeters"
                />
                <div className="text-sm text-slate-600 font-medium">{form.screenDistanceCm} cm</div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Top of monitor at eye level?
                </label>
                <select
                  value={form.monitorTopAtEye}
                  onChange={onSelect("monitorTopAtEye")}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                  aria-label="Top of monitor at eye level"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Keyboard at elbow height?
                </label>
                <select
                  value={form.keyboardAtElbow}
                  onChange={onSelect("keyboardAtElbow")}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                  aria-label="Keyboard at elbow height"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Feet supported?
                </label>
                <select
                  value={form.feetSupported}
                  onChange={onSelect("feetSupported")}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                  aria-label="Feet supported"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Chair has lumbar support?
                </label>
                <select
                  value={form.chairLumbar}
                  onChange={onSelect("chairLumbar")}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                  aria-label="Chair lumbar support"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Glare on screen?
                </label>
                <select
                  value={form.glare}
                  onChange={onSelect("glare")}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                  aria-label="Glare on screen"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Break every (minutes)
                </label>
                <input
                  type="range"
                  min="15"
                  max="120"
                  step="5"
                  value={form.breakEveryMins}
                  onChange={onNumber("breakEveryMins")}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                  aria-label="Break interval in minutes"
                />
                <div className="text-sm text-slate-600 font-medium">{form.breakEveryMins} min</div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button 
                type="submit" 
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                <CheckCircle size={18} />
                {loading ? "Analyzing..." : "Analyze Setup"}
              </button>
              <button 
                type="button" 
                onClick={handleReset}
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 disabled:cursor-not-allowed text-slate-700 font-medium py-3 px-6 rounded-lg border border-slate-200 transition-colors duration-200"
              >
                <RotateCcw size={18} />
                Reset Form
              </button>
            </div>
          </form>
        </div>

        {/* Loading State */}
        {loading && (
          <AnalysisLoader step={loadingStep} />
        )}

        {/* Results */}
        {submitted && !loading && analysisResult && (
          <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg p-6 sm:p-8 hover:bg-white/30 transition-all duration-300" aria-live="polite">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20" role="img" aria-label={`Setup score ${analysisResult.score} percent`}>
                  <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    <path
                      className="fill-none stroke-slate-200 stroke-2"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={`fill-none stroke-2 transition-all duration-1000 ${
                        analysisResult.verdictColor === "green" ? "stroke-green-500" : 
                        analysisResult.verdictColor === "yellow" ? "stroke-yellow-500" : "stroke-red-500"
                      }`}
                      strokeDasharray={`${analysisResult.score}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-slate-800">
                    {analysisResult.score}%
                  </div>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${
                    analysisResult.verdictColor === "green" ? "text-green-600" : 
                    analysisResult.verdictColor === "yellow" ? "text-yellow-600" : "text-red-600"
                  }`}>
                    {analysisResult.verdict}
                  </div>
                  <p className="text-sm text-slate-600">Workspace Assessment</p>
                </div>
              </div>

              {/* Info button */}
              <button
                className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                onClick={() => navigate("/health-info")}
                aria-label="View official health guidance"
              >
                <Info size={16} />
                <span className="hidden sm:inline">Health Info</span>
              </button>
            </div>

            {/* Recommendations */}
            <div className="space-y-3 max-h-80 overflow-y-auto">
              <h4 className="font-semibold text-slate-800 mb-3">Recommendations:</h4>
              {analysisResult.details.map((d, i) => (
                <div 
                  key={i} 
                  className={`flex items-start gap-3 p-3 rounded-lg ${
                    d.ok ? "bg-green-50 border border-green-200" : 
                    d.priority === "high" ? "bg-red-50 border border-red-200" :
                    "bg-yellow-50 border border-yellow-200"
                  }`}
                >
                  {d.ok ? (
                    <CheckCircle className="text-green-600 mt-0.5 flex-shrink-0" size={16} />
                  ) : d.priority === "high" ? (
                    <AlertTriangle className="text-red-600 mt-0.5 flex-shrink-0" size={16} />
                  ) : (
                    <AlertTriangle className="text-yellow-600 mt-0.5 flex-shrink-0" size={16} />
                  )}
                  <p className={`text-sm ${
                    d.ok ? "text-green-800" : 
                    d.priority === "high" ? "text-red-800" : "text-yellow-800"
                  }`}>
                    {d.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Animated Assistant */}
      <AnimatedAssistant
        open={assistantOpen}
        name="Desk Health Assistant"
        position="bottom-right"
        accent="sky"
        steps={[
          { text: "Welcome to your desk health assessment! 🖥️" },
          { text: "Fill out the form with your current setup details." },
          { text: "Need help measuring? Check the 'How to estimate' tips above! 📏" },
          { text: "Click 'Analyze Setup' when ready for your personalized recommendations." },
          { text: "Your health and comfort are our priority! 💪" }
        ]}
        onClose={() => setAssistantOpen(false)}
        onFinish={() => setAssistantOpen(false)}
        width={380}
        typingSpeed={25}
      />
    </div>
  );
};

export default HealthyDesk;
