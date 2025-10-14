import React from "react";

const MetricSelector = ({ metrics, selectedMetric, onSelect }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border">
      <h3 className="text-lg font-semibold text-slate-800 mb-3">
        Select Metric
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {metrics.map((metric) => (
          <button
            key={metric.key}
            onClick={() => onSelect(metric.key)}
            className={`p-3 rounded-lg border transition-all duration-200 ${
              selectedMetric === metric.key
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
            }`}
          >
            <div className="text-sm font-medium">{metric.label}</div>
            {metric.description && (
              <div className="text-xs text-gray-500 mt-1">
                {metric.description}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MetricSelector;
