import React from "react";

const ChartCard = ({ title, subtitle, children }) => {
  return (
    <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-lg border border-white/30 p-6 hover:bg-white/30 transition-all duration-300">
      {/* Title */}
      {title && (
        <h2 className="text-xl font-semibold text-slate-800 mb-2 text-center">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="text-sm text-slate-500 mb-4 text-center">{subtitle}</p>
      )}

      {/* Chart or content */}
      <div className="flex justify-center items-center w-full overflow-x-auto">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
