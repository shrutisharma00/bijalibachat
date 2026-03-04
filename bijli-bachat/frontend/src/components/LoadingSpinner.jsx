import React from "react";

const LoadingSpinner = ({ label = "लोड हो रहा है..." }) => {
  return (
    <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
      <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      <span>{label}</span>
    </div>
  );
};

export default LoadingSpinner;

