import React, { useState } from 'react';
import { PlayerProfile, CoPilotType, SpaceshipType } from '../types';
import { getOnboardingMessage } from '../services/geminiService';
import { SPACESHIPS, COPILOTS } from '../constants';
import { LoadingSpinner } from './shared/LoadingSpinner';

interface OnboardingProps {
  onComplete: (profile: PlayerProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [spaceship, setSpaceship] = useState<SpaceshipType>(SpaceshipType.Starblazer);
  const [coPilot, setCoPilot] = useState<CoPilotType>(CoPilotType.Robot);
  const [isLoading, setIsLoading] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() === '') return;

    setIsLoading(true);
    const profile = { name, spaceship, coPilot };
    
    try {
        const data = await getOnboardingMessage(profile);
        setWelcomeMessage(data.onboarding_message || `Welcome aboard, Captain ${name}! Your journey begins now.`);
    } catch(error) {
        console.error("Failed to get onboarding message", error);
        setWelcomeMessage(`Welcome aboard, Captain ${name}! Your co-pilot is calibrating systems. Your journey begins now.`);
    } finally {
        // Delay completion to show the welcome message
        setTimeout(() => {
            onComplete(profile);
        }, 4000);
    }
  };

  const SelectionCard: React.FC<{
    label: string;
    isSelected: boolean;
    onClick: () => void;
    icon: React.ReactNode;
  }> = ({ label, isSelected, onClick, icon }) => (
    <button
      type="button"
      onClick={onClick}
      className={`bg-slate-800/50 border-2 rounded-lg p-4 text-center transition-all duration-300 transform hover:scale-105 hover:bg-cyan-400/20 w-full h-full flex flex-col items-center justify-center ${
        isSelected ? 'border-cyan-400 shadow-lg shadow-cyan-400/30' : 'border-slate-600'
      }`}
    >
      <div className="w-16 h-16 sm:w-24 sm:h-24 mb-2 text-cyan-400">{icon}</div>
      <span className="font-orbitron tracking-wider">{label}</span>
    </button>
  );

  if (isLoading) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
            <LoadingSpinner />
            <h2 className="font-orbitron text-2xl mt-6 mb-4 text-cyan-300 animate-pulse">Establishing Comms Link...</h2>
            {welcomeMessage && (
                <p className="max-w-md text-lg text-slate-300 animate-fade-in">
                    "{welcomeMessage}"
                </p>
            )}
        </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 sm:p-10 shadow-2xl shadow-black/50">
        <h1 className="font-orbitron text-3xl sm:text-5xl text-center mb-2 text-cyan-300">MIND GALAXY</h1>
        <p className="text-center text-slate-400 mb-8">Chart your inner cosmos. Begin your journey.</p>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label htmlFor="name" className="block font-orbitron text-lg mb-2 text-slate-300">Star Captain's Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900 border-2 border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <h3 className="font-orbitron text-lg mb-4 text-slate-300">Choose Your Spaceship</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {SPACESHIPS.map(({ id, name, icon }) => (
                <SelectionCard
                  key={id}
                  label={name}
                  isSelected={spaceship === id}
                  onClick={() => setSpaceship(id)}
                  icon={icon}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-orbitron text-lg mb-4 text-slate-300">Choose Your AI Co-Pilot</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {COPILOTS.map(({ id, name, icon }) => (
                <SelectionCard
                  key={id}
                  label={name}
                  isSelected={coPilot === id}
                  onClick={() => setCoPilot(id)}
                  icon={icon}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!name}
            className="w-full bg-cyan-500 text-slate-900 font-bold font-orbitron py-4 rounded-lg text-xl tracking-widest uppercase transition-all duration-300 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-400/40 disabled:bg-slate-600 disabled:cursor-not-allowed"
          >
            Begin Journey
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
