import React from "react";

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      {/* Spinner */}
      <div className="w-10 h-10 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
      
      {/* Text */}
      <p className="mt-4 text-slate-600 font-medium text-sm animate-pulse">
        {text}
      </p>
    </div>
  );
};

export default Loader;
