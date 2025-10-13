import React from "react";

const InfoCard = ({ title, value, unit = "", color = "blue", description }) => {
  const colorMap = {
    blue: "from-blue-500 to-blue-400",
    green: "from-green-500 to-green-400",
    orange: "from-orange-500 to-orange-400",
    pink: "from-pink-500 to-pink-400",
    purple: "from-purple-500 to-purple-400",
    red: "from-red-500 to-red-400",
  };

  return (
    <div className="flex flex-col justify-between bg-white/20 backdrop-blur-md border border-white/30 rounded-xl shadow-md p-4 hover:bg-white/30 transition-all duration-300">
      {/* Title */}
      <div className="text-sm font-medium text-slate-600 mb-1">{title}</div>

      {/* Value */}
      <div
        className={`text-2xl font-bold bg-gradient-to-r ${
          colorMap[color] || colorMap.blue
        } text-transparent bg-clip-text`}
      >
        {value}
        {unit && <span className="text-lg ml-1">{unit}</span>}
      </div>

      {/* Description */}
      {description && (
        <p className="text-xs text-slate-500 mt-2 leading-snug">{description}</p>
      )}
    </div>
  );
};

export default InfoCard;
