import React, { useState, useMemo } from "react";
import { API_BASE, request } from "../lib/api";
import { useNavigate } from "react-router-dom";
import { 
  Eye, 
  ArrowLeft, 
  CheckCircle, 
  AlertTriangle,
  Info,
  Activity,
  Clock,
  Monitor,
  Sun,
  Zap
} from "lucide-react";
import { AnimatedAssistant } from "../components/AnimatedAssistant";

const EyeHealthAnalysis = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [assistantOpen, setAssistantOpen] = useState(true);
  const [formData, setFormData] = useState({
    ageGroup: "",
    sex: "",
    screenTime: 8,
    physicalActivity: "",
    state: "NSW",
    remotenessArea: "Major Cities"
  });
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(20);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerAlert, setTimerAlert] = useState(false);

  const ageGroups = [
    "15–24", "25–34", "35–44", "45–54", "55–64"
  ];

  const genders = ["Male", "Female", "Prefer not to say"];

  const physicalActivityLevels = [
    { value: "None", label: "None: 0 hrs" },
    { value: "Low", label: "Low: 1–3 hrs" },
    { value: "Moderate", label: "Moderate: 4–6 hrs" },
    { value: "High", label: "High: 7–10 hrs" }
  ];

  
  const allRecommendations = [
    "Follow the 20-20-20 rule: Look at something 20 feet away for 20 seconds every 20 minutes",
    "Adjust monitor brightness to match your surroundings",
    "Keep your monitor 50-70 cm away from your eyes",
    "Schedule regular eye examinations",
    "Use blue light filtering glasses or screen filters",
    "Ensure adequate natural lighting in your workspace",
    "Practice regular eye relaxation exercises",
    "Maintain a balanced diet rich in eye-healthy nutrients (vitamins A, C, E, zinc, omega-3)"
  ];


  const getRandomRecommendations = () => {
    const shuffled = [...allRecommendations].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };


  const randomRecommendations = useMemo(() => {
    return getRandomRecommendations();
  }, [analysisResult]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleReminderClick = () => {
    setShowReminder(true);
    setTimeout(() => {
      setShowReminder(false);
    }, 3000);
  };

  const startTimer = () => {
    if (timeLeft === 0) {
      setTimeLeft(timerMinutes * 60);
    }
    setIsTimerRunning(true);
    setTimerAlert(false);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(0);
    setTimerAlert(false);
  };

  React.useEffect(() => {
    let interval = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      setTimerAlert(true);
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Time\'s up!', {
          body: 'Time to get up and move around!',
          icon: '/favicon.ico'
        });
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  React.useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  React.useEffect(() => {
    const timerState = {
      timeLeft,
      isTimerRunning,
      timerMinutes,
      timerAlert,
      startTime: isTimerRunning ? Date.now() : null
    };
    localStorage.setItem('eyeHealthTimer', JSON.stringify(timerState));
  }, [timeLeft, isTimerRunning, timerMinutes, timerAlert]);

  React.useEffect(() => {
    const savedTimer = localStorage.getItem('eyeHealthTimer');
    if (savedTimer) {
      try {
        const timerState = JSON.parse(savedTimer);
        setTimerMinutes(timerState.timerMinutes || 20);
        setTimerAlert(timerState.timerAlert || false);
        
        if (timerState.isTimerRunning && timerState.startTime) {
          const elapsed = Math.floor((Date.now() - timerState.startTime) / 1000);
          const remaining = Math.max(0, timerState.timeLeft - elapsed);
          
          if (remaining > 0) {
            setTimeLeft(remaining);
            setIsTimerRunning(true);
          } else {
            setTimeLeft(0);
            setIsTimerRunning(false);
            setTimerAlert(true);
          }
        } else {
          setTimeLeft(timerState.timeLeft || 0);
          setIsTimerRunning(false);
        }
      } catch (error) {
        console.error('Error loading timer state:', error);
      }
    }
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };


  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Convert frontend data to FastAPI format
      const requestData = {
        age: parseInt(formData.ageGroup.split('–')[0]) + 5, // Convert age group to approximate age
        gender: formData.sex,
        screen_time_hours: formData.screenTime,
        physical_activity_hours: getPhysicalActivityHours(formData.physicalActivity)
      };

      const result = await request('/api/eye-health/analyze', {
        method: 'POST',
        body: JSON.stringify(requestData)
      });
      
      // Convert FastAPI response to frontend expected format
      const convertedResult = {
        eye_risk: (result.risk_level + 1) * 25, // Convert 0,1,2 to 25,50,75
        risk_level: result.risk_level_name,
        confidence: result.confidence > 0.8 ? 'High' : result.confidence > 0.6 ? 'Medium' : 'Low',
        recommendations: result.recommendations,
        screen_time_impact: `Your screen time of ${requestData.screen_time_hours} hours/day is ${result.risk_level_name.toLowerCase()} risk`
      };

      setAnalysisResult(convertedResult);
      setCurrentStep(2);
      
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Analysis failed, please try again later');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to convert physical activity level to hours
  const getPhysicalActivityHours = (activity) => {
    switch (activity) {
      case 'None': return 0;
      case 'Low': return 2;
      case 'Moderate': return 4;
      case 'High': return 6;
      default: return 2;
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Eye className="text-blue-600" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Eye Health Assessment</h2>
        <p className="text-slate-600">Please provide your basic information for personalized eye health analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Age Group</label>
          <select
            value={formData.ageGroup}
            onChange={(e) => handleInputChange('ageGroup', e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select age group</option>
            {ageGroups.map(age => (
              <option key={age} value={age}>{age}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
          <select
            value={formData.sex}
            onChange={(e) => handleInputChange('sex', e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select gender</option>
            {genders.map(gender => (
              <option key={gender} value={gender}>{gender}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Physical Activity (hours per day)</label>
          <select
            value={formData.physicalActivity}
            onChange={(e) => handleInputChange('physicalActivity', e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select activity level</option>
            {physicalActivityLevels.map(level => (
              <option key={level.value} value={level.value}>{level.label}</option>
            ))}
          </select>
        </div>

      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-slate-700 mb-3">
          <Monitor className="inline w-4 h-4 mr-2" />
          Daily Screen Time (Hours)
        </label>
        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">0 hours</span>
            <span className="text-lg font-semibold text-blue-600">
              {formData.screenTime} {formData.screenTime === 1 ? 'hour' : 'hours'}
            </span>
            <span className="text-sm text-slate-600">16+ hours</span>
          </div>
          <input
            type="range"
            min="0"
            max="16"
            step="0.5"
            value={formData.screenTime}
            onChange={(e) => handleInputChange('screenTime', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(formData.screenTime / 16) * 100}%, #e2e8f0 ${(formData.screenTime / 16) * 100}%, #e2e8f0 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>Light use</span>
            <span>Moderate</span>
            <span>Heavy use</span>
          </div>
        </div>
      </div>
    </div>
  );


  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <CheckCircle className="text-green-600" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Analysis Results</h2>
        <p className="text-slate-600">Based on your information, we have generated a personalized eye health analysis report</p>
      </div>

      {analysisResult && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <Eye className="text-blue-600" size={24} />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">Eye Health Risk</h3>
              <p className="text-2xl font-bold text-blue-600">{analysisResult.eye_risk?.toFixed(1) || 'N/A'}%</p>
            </div>
            
            <div className="text-center">
              <div className="bg-yellow-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <AlertTriangle className="text-yellow-600" size={24} />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">Risk Level</h3>
              <p className="text-lg font-bold text-yellow-600">
                {analysisResult.risk_level || 'Medium'}
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <Activity className="text-green-600" size={24} />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">Confidence</h3>
              <p className="text-lg font-bold text-green-600">
                {analysisResult.confidence || 'High'}
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <Monitor className="text-purple-600" size={24} />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">Screen Time Impact</h3>
              <p className="text-sm font-bold text-purple-600">
                {formData.screenTime} {formData.screenTime === 1 ? 'hour' : 'hours'}/day
              </p>
              {analysisResult.screen_time_impact && (
                <p className="text-xs text-slate-600 mt-1">
                  {analysisResult.screen_time_impact}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Monitor className="text-purple-600" size={20} />
                Screen Time Impact Analysis
              </h3>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-slate-800 mb-2">Your Current Screen Time</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-500 transition-all duration-300"
                          style={{ width: `${Math.min((formData.screenTime / 16) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-purple-600">
                        {formData.screenTime} hours
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 mb-2">Risk Assessment</h4>
                    <div className="flex items-center gap-2">
                      {analysisResult.risk_level === 'Low' ? (
                        <span className="text-green-600 text-sm font-medium">✅ Low Risk</span>
                      ) : analysisResult.risk_level === 'Medium' ? (
                        <span className="text-yellow-600 text-sm font-medium">⚠️ Moderate Risk</span>
                      ) : analysisResult.risk_level === 'High' ? (
                        <span className="text-orange-600 text-sm font-medium">🔶 High Risk</span>
                      ) : (
                        <span className="text-red-600 text-sm font-medium">🚨 Critical Risk</span>
                      )}
                    </div>
                  </div>
                </div>
                {analysisResult.screen_time_impact && (
                  <div className="mt-3 p-3 bg-white rounded-lg border border-purple-200">
                    <p className="text-sm text-slate-700">
                      <strong>Impact:</strong> {analysisResult.screen_time_impact}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Info className="text-blue-600" size={20} />
                Personalized Recommendations
              </h3>
              <div className="bg-blue-50 rounded-lg p-4">
                <ul className="space-y-2">
                  {randomRecommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="text-blue-600 mt-0.5 flex-shrink-0" size={16} />
                      <span className="text-slate-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Clock className="text-green-600" size={20} />
                Preventive Measures
              </h3>
              <div className="bg-green-50 rounded-lg p-4">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Zap className="text-green-600 mt-0.5 flex-shrink-0" size={16} />
                    <span className="text-slate-700">Use blue light filtering glasses or screen filters</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Sun className="text-green-600 mt-0.5 flex-shrink-0" size={16} />
                    <span className="text-slate-700">Ensure adequate natural lighting in your workspace</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Activity className="text-green-600 mt-0.5 flex-shrink-0" size={16} />
                    <span className="text-slate-700">Practice regular eye relaxation exercises</span>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Clock className="text-orange-600" size={20} />
                Health Reminder
              </h3>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-slate-700 mb-2">Take a break and refresh your mind!</p>
                    <button
                      onClick={handleReminderClick}
                      className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                    >
                      <Sun className="w-4 h-4" />
                      Get Reminder
                    </button>
                  </div>
                </div>
                
                {showReminder && (
                  <div className="mt-4 p-3 bg-green-100 border border-green-200 rounded-lg fade-in">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="text-green-600 w-5 h-5" />
                      <span className="text-green-800 font-medium">
                        Time to step outside for fresh air! 🌿
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Activity className="text-purple-600" size={20} />
                Break Timer
              </h3>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-center mb-4">
                  <div className="text-4xl font-mono font-bold text-purple-600 mb-2">
                    {formatTime(timeLeft)}
                  </div>
                  <p className="text-slate-600 text-sm">
                    {isTimerRunning ? 'Countdown in progress...' : timeLeft === 0 ? 'Ready to start' : 'Paused'}
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Set reminder time (minutes)
                  </label>
                  <div className="bg-white rounded-lg p-3 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-600">5 min</span>
                      <span className="text-lg font-semibold text-purple-600">
                        {timerMinutes} min
                      </span>
                      <span className="text-sm text-slate-600">60 min</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="60"
                      step="5"
                      value={timerMinutes}
                      onChange={(e) => setTimerMinutes(parseInt(e.target.value))}
                      disabled={isTimerRunning}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer timer-slider"
                      style={{
                        background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${((timerMinutes - 5) / 55) * 100}%, #e2e8f0 ${((timerMinutes - 5) / 55) * 100}%, #e2e8f0 100%)`
                      }}
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-center">
                  {!isTimerRunning ? (
                    <button
                      onClick={startTimer}
                      className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                    >
                      <Activity className="w-4 h-4" />
                      {timeLeft === 0 ? 'Start Timer' : 'Resume Timer'}
                    </button>
                  ) : (
                    <button
                      onClick={stopTimer}
                      className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                    >
                      <Clock className="w-4 h-4" />
                      Pause
                    </button>
                  )}
                  
                  <button
                    onClick={resetTimer}
                    className="inline-flex items-center gap-2 bg-slate-500 hover:bg-slate-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                  >
                    <Zap className="w-4 h-4" />
                    Reset
                  </button>
                </div>

                {timerAlert && (
                  <div className="mt-4 p-4 bg-red-100 border border-red-200 rounded-lg fade-in">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="text-red-600 w-5 h-5" />
                      <span className="text-red-800 font-medium">
                        Time's up! Time to get up and move around! 🏃‍♂️
                      </span>
                    </div>
                    <button
                      onClick={() => setTimerAlert(false)}
                      className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                    >
                      Close Alert
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const isStep1Valid = formData.ageGroup && formData.sex && formData.physicalActivity && formData.screenTime !== null;

  return (
    <>
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-sky-50 py-6 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-1/3 w-80 h-80 bg-gradient-to-br from-orange-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-sky-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
      </div>
      <div className="max-w-4xl mx-auto mb-8 relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/healthy-you')}
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-slate-700 font-medium px-4 py-2 rounded-lg border border-white/30 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <ArrowLeft size={16} />
            Back to Health Tips
          </button>
        </div>
        
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">Eye Health Analysis</h1>
          <p className="text-lg text-slate-600">Professional eye health assessment and personalized recommendations</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-center space-x-4">
          {[1, 2].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= step 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-200 text-slate-600'
              }`}>
                {step}
              </div>
              {step < 2 && (
                <div className={`w-16 h-1 mx-2 ${
                  currentStep > step ? 'bg-blue-600' : 'bg-slate-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-2">
          <p className="text-sm text-slate-600">
            {currentStep === 1 && "Basic Information"}
            {currentStep === 2 && "Analysis Results"}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="bg-white/20 backdrop-blur-md rounded-3xl shadow-xl border border-white/30 p-8 hover:bg-white/30 transition-all duration-300">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep3()}
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-6 py-3 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          {currentStep === 2 && (
            <button
              onClick={() => {
                setCurrentStep(1);
                setFormData({
                  ageGroup: "",
                  sex: "",
                  screenTime: 8,
                  physicalActivity: "",
                  state: "NSW",
                  remotenessArea: "Major Cities"
                });
                setAnalysisResult(null);
              }}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              New Assessment
            </button>
          )}
        </div>

        {currentStep === 1 && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleSubmit}
              disabled={!isStep1Valid || isLoading}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Eye size={20} />
                  Start Analysis
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <AnimatedAssistant
        open={assistantOpen}
        name="Eye Health Assistant"
        position="bottom-right"
        accent="sky"
        steps={[
          { text: "Welcome to your eye health assessment! 👁️" },
          { text: "I'll guide you through the analysis process step by step." },
          { text: "Fill out the form with your information to get personalized recommendations." },
          { text: "Your eye health is important - let's keep your vision sharp! 🔍" }
        ]}
        onClose={() => setAssistantOpen(false)}
        onFinish={() => setAssistantOpen(false)}
        width={380}
        typingSpeed={25}
      />
    </div>
    </>
  );
};

export default EyeHealthAnalysis;
