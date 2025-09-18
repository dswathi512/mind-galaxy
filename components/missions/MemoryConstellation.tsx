import React, { useState, useEffect, useCallback } from 'react';
import { Mission } from '../../types';

interface MemoryConstellationProps {
  mission: Mission;
  onComplete: (mission: Mission) => void;
}

const GRID_SIZE = 9;
const MAX_LEVEL = 5;

const MemoryConstellation: React.FC<MemoryConstellationProps> = ({ mission, onComplete }) => {
  const [gameState, setGameState] = useState<'ready' | 'watching' | 'playing' | 'over' | 'won'>('ready');
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [level, setLevel] = useState(1);
  const [activeStar, setActiveStar] = useState<number | null>(null);

  const generateNextInSequence = useCallback(() => {
    const nextStar = Math.floor(Math.random() * GRID_SIZE);
    setSequence(prev => [...prev, nextStar]);
  }, []);

  const startNextLevel = useCallback(() => {
    setPlayerSequence([]);
    generateNextInSequence();
    setGameState('watching');
  }, [generateNextInSequence]);

  // Initial sequence generation
  useEffect(() => {
    if (gameState === 'ready') {
      generateNextInSequence();
    }
  }, [gameState, generateNextInSequence]);

  // Show sequence to player
  useEffect(() => {
    if (gameState === 'watching' && sequence.length > 0) {
      let i = 0;
      const interval = setInterval(() => {
        setActiveStar(sequence[i]);
        i++;
        if (i >= sequence.length) {
          clearInterval(interval);
          setTimeout(() => {
            setActiveStar(null);
            setGameState('playing');
          }, 500);
        }
      }, 700);
      return () => clearInterval(interval);
    }
  }, [gameState, sequence]);
  
  const handleStarClick = (index: number) => {
    if (gameState !== 'playing') return;

    const newPlayerSequence = [...playerSequence, index];
    setPlayerSequence(newPlayerSequence);

    // Check if the latest click was correct
    if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
      setGameState('over');
      return;
    }

    // Check if the sequence is complete
    if (newPlayerSequence.length === sequence.length) {
      if (level === MAX_LEVEL) {
        setGameState('won');
      } else {
        setLevel(prev => prev + 1);
        setTimeout(() => startNextLevel(), 1000);
      }
    }
  };
  
  const startGame = () => {
      setGameState('watching');
  }

  const resetGame = () => {
    setGameState('ready');
    setSequence([]);
    setPlayerSequence([]);
    setLevel(1);
    generateNextInSequence();
    setTimeout(() => startGame(), 500);
  }

  const renderGameContent = () => {
    if (gameState === 'over' || gameState === 'won') {
      return (
        <div className="text-center">
          <h3 className="font-orbitron text-3xl text-cyan-300">
            {gameState === 'won' ? 'Constellation Charted!' : 'Sequence Lost'}
            </h3>
          <p className="text-2xl mt-4">
            {gameState === 'won' ? `You reached level ${level}!` : `You made it to level ${level}.`}
            </p>
          <p className="mt-2 text-slate-400">
            {gameState === 'won' ? 'Your focus was truly stellar, Captain!' : 'A momentary lapse in the cosmic flow. Try again!'}
            </p>
          {gameState === 'won' ? (
             <button
                onClick={() => onComplete(mission)}
                className="mt-6 w-full bg-cyan-500 text-slate-900 font-bold font-orbitron py-3 rounded-lg text-lg tracking-widest uppercase transition-all duration-300 hover:bg-cyan-400"
              >
                Claim Reward
              </button>
          ) : (
             <button
                onClick={resetGame}
                className="mt-6 w-full bg-yellow-500 text-slate-900 font-bold font-orbitron py-3 rounded-lg text-lg tracking-widest uppercase transition-all duration-300 hover:bg-yellow-400"
              >
                Retry Mission
              </button>
          )}
        </div>
      );
    }
    
    if (gameState === 'ready') {
       return (
        <div className="text-center">
          <h3 className="font-orbitron text-3xl text-cyan-300">{mission.mission_name}</h3>
          <p className="mt-4 text-slate-300">{mission.objective}</p>
          <p className="mt-2 text-slate-400">{mission.mechanics}</p>
           <button
            onClick={startGame}
            className="mt-6 w-full bg-cyan-500 text-slate-900 font-bold font-orbitron py-3 rounded-lg text-lg tracking-widest uppercase transition-all duration-300 hover:bg-cyan-400"
          >
            Start Mission
          </button>
        </div>
      );
    }

    // 'watching' or 'playing' state
    const statusText = gameState === 'watching' ? 'Memorize the sequence...' : 'Your turn, Captain...';
    
    return (
      <div className="w-full h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
            <div className="font-orbitron text-xl">Level: {level} / {MAX_LEVEL}</div>
            <div className="font-orbitron text-xl animate-pulse">{statusText}</div>
        </div>
        <div className="flex-grow grid grid-cols-3 gap-4">
            {Array.from({ length: GRID_SIZE }).map((_, index) => (
                <button
                    key={index}
                    onClick={() => handleStarClick(index)}
                    disabled={gameState !== 'playing'}
                    className={`w-full h-full rounded-full flex items-center justify-center transition-all duration-200
                        ${activeStar === index ? 'bg-yellow-400 shadow-lg shadow-yellow-400/50 scale-110' : 'bg-slate-700 hover:bg-slate-600'}
                        ${gameState !== 'playing' ? 'cursor-default' : 'cursor-pointer'}
                    `}
                    aria-label={`Star ${index + 1}`}
                >
                    <div className="text-4xl text-yellow-200 opacity-80">✦</div>
                </button>
            ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full h-[70vh] max-h-[600px] bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 sm:p-10 shadow-2xl shadow-black/50 flex flex-col justify-center">
        {renderGameContent()}
      </div>
    </div>
  );
};

export default MemoryConstellation;
