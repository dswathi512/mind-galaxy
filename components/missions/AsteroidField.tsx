import React, { useState, useEffect, useCallback } from 'react';
import { Mission } from '../../types';

interface AsteroidFieldProps {
  mission: Mission;
  onComplete: (mission: Mission) => void;
}

interface Asteroid {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
}

const GAME_DURATION = 15; // seconds

const AsteroidField: React.FC<AsteroidFieldProps> = ({ mission, onComplete }) => {
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'over'>('ready');
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);

  const createAsteroid = useCallback(() => {
    const newAsteroid: Asteroid = {
      id: Date.now() + Math.random(),
      x: Math.random() * 100,
      y: -10, // Start above the screen
      size: Math.random() * 40 + 20, // size 20px to 60px
      speed: Math.random() * 0.3 + 0.1,
    };
    setAsteroids(prev => [...prev, newAsteroid]);
  }, []);

  // Game loop for moving asteroids and spawning new ones
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameInterval = setInterval(() => {
      setAsteroids(prev =>
        prev
          .map(a => ({ ...a, y: a.y + a.speed }))
          .filter(a => a.y < 120) // Remove asteroids that go off screen
      );
      
      if (Math.random() < 0.1) { // Chance to spawn a new asteroid
        createAsteroid();
      }
    }, 16); // ~60fps

    const timerInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameState('over');
          clearInterval(gameInterval);
          clearInterval(timerInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(gameInterval);
      clearInterval(timerInterval);
    };
  }, [gameState, createAsteroid]);

  const handleAsteroidClick = (id: number) => {
    setAsteroids(prev => prev.filter(a => a.id !== id));
    setScore(prev => prev + 10);
  };
  
  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setAsteroids([]);
    setGameState('playing');
  }

  const renderGameContent = () => {
    if (gameState === 'over') {
      return (
        <div className="text-center">
          <h3 className="font-orbitron text-3xl text-cyan-300">Mission Debrief</h3>
          <p className="text-2xl mt-4">Score: {score}</p>
          <p className="mt-2 text-slate-400">You successfully cleared the asteroid field!</p>
          <button
            onClick={() => onComplete(mission)}
            className="mt-6 w-full bg-cyan-500 text-slate-900 font-bold font-orbitron py-3 rounded-lg text-lg tracking-widest uppercase transition-all duration-300 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-400/40"
          >
            Claim Reward
          </button>
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
            className="mt-6 w-full bg-cyan-500 text-slate-900 font-bold font-orbitron py-3 rounded-lg text-lg tracking-widest uppercase transition-all duration-300 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-400/40"
          >
            Start Mission
          </button>
        </div>
      );
    }

    // 'playing' state
    return (
      <div className="w-full h-full bg-black/50 rounded-lg relative overflow-hidden border-2 border-cyan-500">
        {asteroids.map(asteroid => (
          <div
            key={asteroid.id}
            className="absolute text-4xl cursor-pointer"
            style={{
              left: `${asteroid.x}%`,
              top: `${asteroid.y}%`,
              fontSize: `${asteroid.size}px`,
              transform: 'translate(-50%, -50%)',
            }}
            onClick={() => handleAsteroidClick(asteroid.id)}
            role="button"
            aria-label="Blast asteroid"
          >
            ☄️
          </div>
        ))}
        <div className="absolute top-2 left-4 font-orbitron text-xl">Score: {score}</div>
        <div className="absolute top-2 right-4 font-orbitron text-xl">Time: {timeLeft}</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full h-[60vh] bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 sm:p-10 shadow-2xl shadow-black/50 flex flex-col justify-center">
        {renderGameContent()}
      </div>
    </div>
  );
};

export default AsteroidField;
