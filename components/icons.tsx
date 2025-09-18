
import React from 'react';

// Using simple paths for demonstration. In a real app, these would be more detailed.
export const Spaceship1Icon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
    <path d="M12 2L2 22h20L12 2zM12 14v6" />
  </svg>
);

export const Spaceship2Icon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
    <path d="M4 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8-8-3.582-8-8z" />
    <path d="M2 12h4m12 0h4" />
    <path d="M12 2L8 6m4-4l4 4" />
  </svg>
);

export const Spaceship3Icon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
    <path d="M12 2l-2 7h4l-2-7z" />
    <path d="M5 22h14l-3-7H8l-3 7z" />
    <path d="M8 15l-6-4h20l-6 4" />
  </svg>
);

export const RobotIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
    <rect x="5" y="8" width="14" height="12" rx="2" />
    <rect x="9" y="4" width="6" height="4" rx="1" />
    <path d="M9 14h6M3 12h2m14 0h2" />
    <circle cx="9" cy="12" r="1" fill="currentColor" />
    <circle cx="15" cy="12" r="1" fill="currentColor" />
  </svg>
);

export const DroidIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
    <circle cx="12" cy="12" r="8" />
    <rect x="11" y="8" width="2" height="4" />
    <path d="M12 20v-4" />
    <path d="M4 16l4-2m8 2l4-2" />
  </svg>
);

export const AlienIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
    <path d="M12 4c-4 0-8 4-8 8s4 8 8 8 8-4 8-8-4-8-8-8z" />
    <ellipse cx="9" cy="10" rx="1" ry="2" fill="currentColor" />
    <ellipse cx="15" cy="10" rx="1" ry="2" fill="currentColor" />
    <path d="M9 16c1-1 2.5-1.5 3-1.5s2 .5 3 1.5" />
  </svg>
);

export const BackgroundStars: React.FC = () => (
    <div className="absolute inset-0 z-0 pointer-events-none">
        <div id="stars1" className="absolute w-full h-full bg-transparent bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:100px_100px] animate-fade-in"></div>
        <div id="stars2" className="absolute w-full h-full bg-transparent bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:150px_150px] animate-fade-in animation-delay-1000"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900"></div>
        <style>{`
        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 0.3; }
        }
        .animation-delay-1000 { animation-delay: 1s; }
        `}</style>
    </div>
);
