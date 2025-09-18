export enum CoPilotType {
  Robot = 'Robot',
  Droid = 'Droid',
  Alien = 'Alien',
}

export enum SpaceshipType {
  Starblazer = 'Starblazer',
  Nebulon = 'Nebulon',
  Quasar = 'Quasar',
}

export interface PlayerProfile {
  name: string;
  spaceship: SpaceshipType;
  coPilot: CoPilotType;
}

export interface Mission {
  mission_name: string;
  objective: string;
  mechanics: string;
  reward: string;
  co_pilot_message?: string;
}

export interface GameData {
  onboarding_message?: string;
  daily_reward?: string;
  suggested_missions?: Mission[];
  co_pilot_message?: string;
  distress_detected?: boolean;
  support_hint?: string;
}

export interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  name?: string;
}