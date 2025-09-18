
import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="relative w-20 h-20">
      <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
      <div className="absolute inset-0 border-t-4 border-cyan-400 rounded-full animate-spin"></div>
    </div>
  );
};
