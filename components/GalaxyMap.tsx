
import React from 'react';
import { Star } from '../types';

interface GalaxyMapProps {
  stars: Star[];
}

const GalaxyMap: React.FC<GalaxyMapProps> = ({ stars }) => {
  return (
    <div className="w-full h-full bg-black/50 rounded-lg relative overflow-hidden">
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        {stars.map((star) => (
          <circle
            key={star.id}
            cx={star.x}
            cy={star.y}
            r={star.size / 2}
            fill={star.color}
            className="animate-pulse"
          >
            <title>{star.name}</title>
          </circle>
        ))}
      </svg>
      {stars.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-center p-4">
          <p>Your galaxy is waiting. Complete missions to discover new stars.</p>
        </div>
      )}
    </div>
  );
};

export default GalaxyMap;
