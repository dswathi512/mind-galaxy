import React, { useState, useEffect } from 'react';
import { PlayerProfile, GameData, Star, Mission } from '../types';
import { getDailyReward, getMissionsAndMessages } from '../services/geminiService';
import GalaxyMap from './GalaxyMap';
import { LoadingSpinner } from './shared/LoadingSpinner';
import Modal from './shared/Modal';
import { COPILOTS, SPACESHIPS } from '../constants';
import AsteroidField from './missions/AsteroidField';
import MemoryConstellation from './missions/MemoryConstellation';

interface GameDashboardProps {
  playerProfile: PlayerProfile;
}

const CoPilotMessage: React.FC<{ message: string; coPilot: PlayerProfile['coPilot'] }> = ({ message, coPilot }) => {
    const coPilotData = COPILOTS.find(c => c.id === coPilot);
    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex items-start space-x-4">
            <div className="w-12 h-12 text-cyan-400 flex-shrink-0">{coPilotData?.icon}</div>
            <div>
                <h4 className="font-orbitron text-cyan-300">{coPilotData?.name} Co-Pilot</h4>
                <p className="text-slate-300 text-sm sm:text-base">"{message}"</p>
            </div>
        </div>
    );
};

const GameDashboard: React.FC<GameDashboardProps> = ({ playerProfile }) => {
  const [mood, setMood] = useState('');
  const [gameData, setGameData] = useState<GameData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showDailyReward, setShowDailyReward] = useState(false);
  const [missionReward, setMissionReward] = useState<string | null>(null);
  const [stars, setStars] = useState<Star[]>([]);
  const [activeMission, setActiveMission] = useState<Mission | null>(null);

  useEffect(() => {
    const fetchDailyReward = async () => {
      setIsLoading(true);
      try {
        const data = await getDailyReward(playerProfile);
        setGameData(prev => ({ ...prev, daily_reward: data.daily_reward || "Welcome back, Captain! Your presence illuminates the cosmos." }));
        setShowDailyReward(true);
      } catch(error) {
        console.error("Failed to fetch daily reward:", error);
        setGameData(prev => ({ ...prev, daily_reward: "Log-in confirmed. Welcome back, Captain! The cosmos awaits." }));
        setShowDailyReward(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDailyReward();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerProfile]);

  const handleMoodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mood.trim() === '') return;
    setIsLoading(true);
    setGameData({});
    try {
        const data = await getMissionsAndMessages(playerProfile, mood);
        setGameData(data);
    } catch (error) {
        console.error("Failed to get missions:", error);
        setGameData({
            co_pilot_message: "We're experiencing some interference on the comms channel, Captain. Let's try recalibrating. Please try logging your mood again.",
            suggested_missions: [],
        });
    } finally {
        setIsLoading(false);
    }
  };

  const handleMissionAccept = (mission: Mission) => {
    const missionNameLower = mission.mission_name.toLowerCase();
    if (missionNameLower.includes('asteroid field') || missionNameLower.includes('memory constellation')) {
      setActiveMission(mission);
    } else {
      handleMissionComplete(mission);
    }
  };

  const handleMissionComplete = (mission: Mission) => {
    setMissionReward(`Mission "${mission.mission_name}" complete! Reward: ${mission.reward}`);
    const newStar: Star = {
      id: Date.now(),
      x: Math.random() * 90 + 5,
      y: Math.random() * 90 + 5,
      size: Math.random() * 3 + 1,
      color: ['#FFFFFF', '#add8e6', '#f0e68c'][Math.floor(Math.random() * 3)],
      name: mission.mission_name,
    };
    setStars(prevStars => [...prevStars, newStar]);
    
    setGameData(prev => {
      const remainingMissions = prev.suggested_missions?.filter(m => m.mission_name !== mission.mission_name) || [];
      const newCoPilotMessage = remainingMissions.length > 0
        ? `Excellent work on that mission, Captain ${playerProfile.name}! Ready for another? The galaxy awaits.`
        : `All missions for this log complete, Captain ${playerProfile.name}! Your galaxy shines brighter with every completed task.`;
      
      return {
        ...prev,
        suggested_missions: remainingMissions,
        co_pilot_message: mission.co_pilot_message || newCoPilotMessage,
      };
    });
    
    setActiveMission(null);
  };

  const renderActiveMission = () => {
    if (!activeMission) return null;
    const missionNameLower = activeMission.mission_name.toLowerCase();

    if (missionNameLower.includes('asteroid field')) {
      return <AsteroidField mission={activeMission} onComplete={handleMissionComplete} />;
    }
    if (missionNameLower.includes('memory constellation')) {
      return <MemoryConstellation mission={activeMission} onComplete={handleMissionComplete} />;
    }

    // Fallback for any other mission type that might get set as active
    handleMissionComplete(activeMission);
    return null;
  }

  const spaceshipData = SPACESHIPS.find(s => s.id === playerProfile.spaceship);

  if (activeMission) {
    return renderActiveMission();
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="font-orbitron text-3xl text-cyan-300">Captain {playerProfile.name}'s Log</h1>
        <div className="flex items-center space-x-2 text-slate-400 mt-2 sm:mt-0">
          <div className="w-8 h-8">{spaceshipData?.icon}</div>
          <span>{spaceshipData?.name}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <main className="lg:col-span-2 space-y-6">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
            <h2 className="font-orbitron text-xl mb-4 text-slate-100">Daily Report</h2>
            <form onSubmit={handleMoodSubmit}>
              <label htmlFor="mood" className="block text-slate-400 mb-2">How are the cosmic currents flowing today, Captain?</label>
              <div className="flex space-x-2">
                <input
                  id="mood"
                  type="text"
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="w-full bg-slate-900 border-2 border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition"
                  placeholder="e.g., feeling tired and stressed"
                />
                <button type="submit" className="bg-cyan-500 text-slate-900 font-bold px-6 py-2 rounded-lg transition hover:bg-cyan-400 disabled:bg-slate-600" disabled={isLoading || !mood}>Log</button>
              </div>
            </form>
          </div>
          
          {isLoading && <div className="flex justify-center p-8"><LoadingSpinner /></div>}
          
          {gameData.co_pilot_message && (
            <CoPilotMessage message={gameData.co_pilot_message} coPilot={playerProfile.coPilot} />
          )}

          {gameData.distress_detected && gameData.support_hint && (
            <div className="bg-yellow-900/50 border border-yellow-500 rounded-lg p-4 text-yellow-200">
                <h4 className="font-bold">System Alert</h4>
                <p>{gameData.support_hint}</p>
            </div>
          )}

          {gameData.suggested_missions && gameData.suggested_missions.length > 0 && (
            <div>
              <h3 className="font-orbitron text-xl mb-4">Suggested Missions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gameData.suggested_missions.map((mission, index) => (
                  <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 transition-all hover:border-cyan-400 hover:scale-[1.02] flex flex-col">
                    <div className="flex-grow">
                      <h4 className="font-orbitron text-lg text-cyan-300 mb-2">{mission.mission_name}</h4>
                      <p className="text-slate-400 text-sm mb-1"><strong className="text-slate-300">Objective:</strong> {mission.objective}</p>
                      <p className="text-slate-400 text-sm mb-3"><strong className="text-slate-300">Reward:</strong> {mission.reward}</p>
                    </div>
                    <button onClick={() => handleMissionAccept(mission)} className="w-full mt-2 bg-slate-700 text-cyan-300 font-semibold py-2 rounded-lg transition hover:bg-cyan-500 hover:text-slate-900">
                      Accept Mission
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        <aside className="lg:col-span-1">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 aspect-square">
            <h3 className="font-orbitron text-xl mb-4 text-center">Your Galaxy</h3>
            <GalaxyMap stars={stars} />
          </div>
        </aside>
      </div>

      <Modal isOpen={showDailyReward} onClose={() => setShowDailyReward(false)} title="Daily Log-In Reward">
        <p className="text-slate-300">{gameData.daily_reward}</p>
      </Modal>
      
      <Modal isOpen={!!missionReward} onClose={() => setMissionReward(null)} title="Mission Complete!">
        <p className="text-slate-300">{missionReward}</p>
      </Modal>
    </div>
  );
};

export default GameDashboard;