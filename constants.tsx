
import React from 'react';
import { CoPilotType, SpaceshipType } from './types';
import { AlienIcon, DroidIcon, RobotIcon, Spaceship1Icon, Spaceship2Icon, Spaceship3Icon } from './components/icons';

export const SPACESHIPS = [
  { id: SpaceshipType.Starblazer, name: 'Starblazer', icon: <Spaceship1Icon /> },
  { id: SpaceshipType.Nebulon, name: 'Nebulon', icon: <Spaceship2Icon /> },
  { id: SpaceshipType.Quasar, name: 'Quasar', icon: <Spaceship3Icon /> },
];

export const COPILOTS = [
  { id: CoPilotType.Robot, name: 'Robot', icon: <RobotIcon /> },
  { id: CoPilotType.Droid, name: 'Droid', icon: <DroidIcon /> },
  { id: CoPilotType.Alien, name: 'Alien', icon: <AlienIcon /> },
];
