
import React, { useState, useCallback } from 'react';
import Onboarding from './components/Onboarding';
import GameDashboard from './components/GameDashboard';
import { PlayerProfile } from './types';
import { BackgroundStars } from './components/icons';

const App: React.FC = () => {
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile | null>(null);

  const handleOnboardingComplete = useCallback((profile: PlayerProfile) => {
    setPlayerProfile(profile);
  }, []);

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen w-full relative overflow-hidden">
      <BackgroundStars />
      <div className="relative z-10">
        {playerProfile ? (
          <GameDashboard playerProfile={playerProfile} />
        ) : (
          <Onboarding onComplete={handleOnboardingComplete} />
        )}
      </div>
    </div>
  );
};

export default App;
