import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExternalLink, ArrowLeft, Heart } from "lucide-react";
// Static sedentary data for 2022 (Australia)
const STATIC_SEDENTARY = {
  year: 2022,
  breakdown: [
    { age_group: "18-24", sitting: 22.80, standing: 26.80, walking: 33.50, physically_demanding: 17.40 },
    { age_group: "25-34", sitting: 45.50, standing: 19.40, walking: 20.20, physically_demanding: 14.40 },
    { age_group: "35-44", sitting: 54.40, standing: 17.40, walking: 16.10, physically_demanding: 11.80 },
    { age_group: "45-54", sitting: 52.90, standing: 16.30, walking: 16.90, physically_demanding: 13.50 },
    { age_group: "55-64", sitting: 50.60, standing: 17.00, walking: 20.20, physically_demanding: 11.30 },
  ],
};

// Static physical activity guidelines data for 2022 (Australia)
const STATIC_ACTIVITY_GUIDELINES = {
  year: 2022,
  breakdown: [
    { age_group: "18-24", met_guidelines: 31.30, min_150: 80.50, days_5plus: 69.70, strength_2days: 36.00 },
    { age_group: "25-34", met_guidelines: 27.20, min_150: 76.80, days_5plus: 70.80, strength_2days: 32.40 },
    { age_group: "35-44", met_guidelines: 21.70, min_150: 73.10, days_5plus: 66.90, strength_2days: 25.40 },
    { age_group: "45-54", met_guidelines: 17.70, min_150: 73.50, days_5plus: 66.40, strength_2days: 21.00 },
    { age_group: "55-64", met_guidelines: 16.10, min_150: 68.40, days_5plus: 63.10, strength_2days: 19.90 },
  ],
};

const HealthInfo = () => {
  const navigate = useNavigate();
  
  return (
    <div className="relative min-h-screen p-6 sm:p-8 bg-gradient-to-br from-orange-50 via-pink-50 to-sky-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/3 left-0 w-72 h-72 bg-gradient-to-br from-orange-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-gradient-to-br from-sky-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
      </div>
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Navigation Buttons */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-slate-700 font-medium px-4 py-2 rounded-lg border border-white/30 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
          <button
            onClick={() => navigate("/stress-buster")}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-md hover:from-pink-500/30 hover:to-purple-500/30 text-slate-700 font-medium px-4 py-2 rounded-lg border border-pink-300/30 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Heart size={16} />
            Go to Stress Buster
          </button>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center">Health Information</h1>

        {/* National Sedentary (2022) */}
        <section className="mb-8">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-lg border border-white/30 p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-3">National Sedentary (2022)</h2>
            <SedentaryBlock />
          </div>
        </section>

        {/* Physical Activity Guidelines (2022) */}
        <section className="mb-8">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-lg border border-white/30 p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-3">Physical Activity Guidelines Compliance (2022)</h2>
            <ActivityGuidelinesBlock />
          </div>
        </section>
        <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-lg border border-white/30 p-8 hover:bg-white/30 transition-all duration-300">
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            Here you'll find workstation standards, eye health, and Vitamin D info from trusted government resources.
          </p>
          <div className="space-y-4">
            <a
              href="https://www.safeworkaustralia.gov.au/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300 group"
            >
              <ExternalLink className="text-blue-600 group-hover:scale-110 transition-transform" size={20} />
              <span className="text-gray-800 font-medium">Safe Work Australia</span>
            </a>
            <a
              href="https://www.worksafe.vic.gov.au/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300 group"
            >
              <ExternalLink className="text-blue-600 group-hover:scale-110 transition-transform" size={20} />
              <span className="text-gray-800 font-medium">WorkSafe Victoria</span>
            </a>
            <a
              href="https://www.health.gov.au/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300 group"
            >
              <ExternalLink className="text-blue-600 group-hover:scale-110 transition-transform" size={20} />
              <span className="text-gray-800 font-medium">Australian Government Health</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthInfo;

/* ---- Components ---- */
function SedentaryBlock() {
  const [rows] = useState(STATIC_SEDENTARY.breakdown);
  const [selectedMetric, setSelectedMetric] = useState('sitting');

  const metrics = [
    { key: 'sitting', label: 'Sitting', color: 'from-red-500 to-red-400', description: 'Mostly sitting during workday' },
    { key: 'standing', label: 'Standing', color: 'from-yellow-500 to-yellow-400', description: 'Mostly standing during workday' },
    { key: 'walking', label: 'Walking', color: 'from-green-500 to-green-400', description: 'Mostly walking during workday' },
    { key: 'physically_demanding', label: 'Physically Demanding', color: 'from-blue-500 to-blue-400', description: 'Physically demanding activities' },
  ];

  const selectedData = rows.map(r => ({
    age_group: r.age_group,
    value: r[selectedMetric]
  }));

  const sedentaryAvg = useMemo(() => {
    if (!rows.length) return 0;
    const s = rows.reduce((a, r) => a + (r[selectedMetric] || 0), 0) / rows.length;
    return Number(s.toFixed(2));
  }, [rows, selectedMetric]);

  const maxPct = useMemo(() => {
    return Math.max(...selectedData.map(d => d.value)) || 0;
  }, [selectedData]);

  return (
    <div>
      <div className="space-y-4">
        {/* Metric Selector */}
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <h3 className="text-lg font-semibold text-slate-800 mb-3">Select Activity Type</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {metrics.map((metric) => (
              <button
                key={metric.key}
                onClick={() => setSelectedMetric(metric.key)}
                className={`p-3 rounded-lg border transition-all ${
                  selectedMetric === metric.key
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="text-sm font-medium">{metric.label}</div>
                <div className="text-xs text-gray-500 mt-1">{metric.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* KPI */}
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="text-sm text-slate-600">National {metrics.find(m => m.key === selectedMetric)?.label.toLowerCase()} rate (avg)</div>
          <div className="text-3xl font-bold text-amber-700">{sedentaryAvg.toFixed(2)}%</div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">
            {metrics.find(m => m.key === selectedMetric)?.label} Distribution by Age Group (2022)
          </h3>
          
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
            {/* Pie Chart */}
            <div className="relative w-64 h-64">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {/* Define gradients */}
                <defs>
                  <linearGradient id="gradient-red" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#f87171" />
                  </linearGradient>
                  <linearGradient id="gradient-orange" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#fb923c" />
                  </linearGradient>
                  <linearGradient id="gradient-yellow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#eab308" />
                    <stop offset="100%" stopColor="#facc15" />
                  </linearGradient>
                  <linearGradient id="gradient-green" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#4ade80" />
                  </linearGradient>
                  <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#60a5fa" />
                  </linearGradient>
                </defs>
                
                {(() => {
                  const total = selectedData.reduce((sum, item) => sum + item.value, 0);
                  let currentAngle = 0;
                  const gradients = [
                    'url(#gradient-red)',
                    'url(#gradient-orange)', 
                    'url(#gradient-yellow)',
                    'url(#gradient-green)',
                    'url(#gradient-blue)'
                  ];
                  
                  return selectedData.map((point, index) => {
                    const percentage = (point.value / total) * 100;
                    const angle = (point.value / total) * 360;
                    const startAngle = currentAngle;
                    const endAngle = currentAngle + angle;
                    
                    const startAngleRad = (startAngle * Math.PI) / 180;
                    const endAngleRad = (endAngle * Math.PI) / 180;
                    
                    const x1 = 100 + 80 * Math.cos(startAngleRad);
                    const y1 = 100 + 80 * Math.sin(startAngleRad);
                    const x2 = 100 + 80 * Math.cos(endAngleRad);
                    const y2 = 100 + 80 * Math.sin(endAngleRad);
                    
                    const largeArcFlag = angle > 180 ? 1 : 0;
                    
                    const pathData = [
                      `M 100 100`,
                      `L ${x1} ${y1}`,
                      `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                      `Z`
                    ].join(' ');
                    
                    currentAngle += angle;
                    
                    return (
                      <path
                        key={point.age_group}
                        d={pathData}
                        fill={gradients[index % gradients.length]}
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                        title={`${point.age_group}: ${point.value.toFixed(1)}% (${percentage.toFixed(1)}% of pie)`}
                      />
                    );
                  });
                })()}
                
                {/* Center circle */}
                <circle cx="100" cy="100" r="40" fill="white" stroke="#e5e7eb" strokeWidth="2" />
                <text x="100" y="95" textAnchor="middle" className="text-sm font-semibold text-slate-700">
                  {metrics.find(m => m.key === selectedMetric)?.label}
                </text>
                <text x="100" y="110" textAnchor="middle" className="text-xs text-slate-500">
                  Distribution
                </text>
              </svg>
            </div>
            
            {/* Legend */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Age Groups</h4>
              {selectedData.map((point, index) => {
                const percentage = (point.value / selectedData.reduce((sum, item) => sum + item.value, 0)) * 100;
                const colors = [
                  'bg-red-500',
                  'bg-orange-500', 
                  'bg-yellow-500',
                  'bg-green-500',
                  'bg-blue-500'
                ];
                
                return (
                  <div key={point.age_group} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${colors[index % colors.length]}`}></div>
                    <div className="text-sm text-slate-700">
                      <span className="font-medium">{point.age_group}:</span>
                      <span className="ml-1">{point.value.toFixed(1)}%</span>
                      <span className="text-xs text-slate-500 ml-1">({percentage.toFixed(1)}% of pie)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Chart description */}
          <div className="mt-6 text-sm text-slate-600 text-center">
            Data shows the distribution of {metrics.find(m => m.key === selectedMetric)?.label.toLowerCase()} across different age groups in Australia (2022)
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Activity Guidelines Component ---- */
function ActivityGuidelinesBlock() {
  const [rows] = useState(STATIC_ACTIVITY_GUIDELINES.breakdown);
  const [selectedMetric, setSelectedMetric] = useState('met_guidelines');

  const metrics = [
    { key: 'met_guidelines', label: 'Met Guidelines', color: 'from-blue-500 to-blue-400', description: 'Percentage meeting all activity guidelines' },
    { key: 'min_150', label: '150+ Min/Week', color: 'from-green-500 to-green-400', description: 'Percentage with 150+ minutes activity per week' },
    { key: 'days_5plus', label: '5+ Days Active', color: 'from-purple-500 to-purple-400', description: 'Percentage active 5+ days per week' },
    { key: 'strength_2days', label: '2+ Strength Days', color: 'from-orange-500 to-orange-400', description: 'Percentage with 2+ strength training days' },
  ];

  const selectedData = rows.map(r => ({
    age_group: r.age_group,
    value: r[selectedMetric]
  }));

  const maxValue = Math.max(...selectedData.map(d => d.value));
  const minValue = Math.min(...selectedData.map(d => d.value));

  return (
    <div>
      <div className="space-y-4">
        {/* Metric Selector */}
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <h3 className="text-lg font-semibold text-slate-800 mb-3">Select Activity Metric</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {metrics.map((metric) => (
              <button
                key={metric.key}
                onClick={() => setSelectedMetric(metric.key)}
                className={`p-3 rounded-lg border transition-all ${
                  selectedMetric === metric.key
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="text-sm font-medium">{metric.label}</div>
                <div className="text-xs text-gray-500 mt-1">{metric.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">
            {metrics.find(m => m.key === selectedMetric)?.label} by Age Group (2022)
          </h3>
          
          <div className="overflow-x-auto">
            <div className="min-w-[640px]">
              {/* Y-axis labels */}
              <div className="flex items-end h-64 px-8">
                <div className="flex flex-col justify-between h-full mr-4">
                  {[100, 80, 60, 40, 20, 0].map(val => (
                    <div key={val} className="text-xs text-slate-500 text-right">{val}%</div>
                  ))}
                </div>
                
                {/* Chart area */}
                <div className="flex-1 flex items-end justify-between px-4 relative">
                  {/* Grid lines */}
                  {[0, 20, 40, 60, 80, 100].map(val => (
                    <div
                      key={val}
                      className="absolute w-full border-t border-gray-200"
                      style={{ bottom: `${val}%` }}
                    />
                  ))}
                  
                  {/* Bars */}
                  {selectedData.map((point) => {
                    const height = (point.value / maxValue) * 200;
                    return (
                      <div key={point.age_group} className="flex flex-col items-center">
                        {/* Bar */}
                        <div
                          className={`w-16 rounded-t-lg bg-gradient-to-t ${metrics.find(m => m.key === selectedMetric)?.color} shadow-md border border-white/20 relative group`}
                          style={{ height: `${height}px`, minHeight: '8px' }}
                          title={`${point.age_group}: ${point.value.toFixed(1)}%`}
                        >
                          {/* Value label */}
                          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {point.value.toFixed(1)}%
                          </div>
                        </div>
                        
                        {/* Age group label */}
                        <div className="mt-3 text-sm text-slate-700 font-medium">{point.age_group}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* X-axis label */}
              <div className="text-center mt-4">
                <div className="text-sm font-medium text-slate-600">Age Group</div>
              </div>
            </div>
          </div>
          
          {/* Chart description */}
          <div className="mt-4 text-sm text-slate-600 text-center">
            Data shows the percentage of each age group meeting physical activity guidelines in Australia (2022)
          </div>
        </div>
      </div>
    </div>
  );
}
