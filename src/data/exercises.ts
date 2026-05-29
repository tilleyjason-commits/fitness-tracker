import type { Exercise } from '../types';

export const EXERCISES: Exercise[] = [
  // Chest
  { id: 'chest-press-machine', name: 'Chest Press Machine', muscleGroup: 'Chest' },
  { id: 'pec-deck', name: 'Pec Deck / Chest Fly', muscleGroup: 'Chest' },
  { id: 'cable-crossover', name: 'Cable Crossover', muscleGroup: 'Chest' },
  { id: 'incline-chest-press', name: 'Incline Chest Press Machine', muscleGroup: 'Chest' },

  // Back
  { id: 'lat-pulldown', name: 'Lat Pulldown', muscleGroup: 'Back' },
  { id: 'seated-cable-row', name: 'Seated Cable Row', muscleGroup: 'Back' },
  { id: 'chest-supported-row', name: 'Chest Supported Row', muscleGroup: 'Back' },
  { id: 'cable-pullover', name: 'Cable Pullover', muscleGroup: 'Back' },
  { id: 'reverse-fly-machine', name: 'Reverse Fly Machine', muscleGroup: 'Back' },

  // Shoulders
  { id: 'shoulder-press-machine', name: 'Shoulder Press Machine', muscleGroup: 'Shoulders' },
  { id: 'lateral-raise-machine', name: 'Lateral Raise Machine', muscleGroup: 'Shoulders' },
  { id: 'cable-lateral-raise', name: 'Cable Lateral Raise', muscleGroup: 'Shoulders' },
  { id: 'rear-delt-fly-machine', name: 'Rear Delt Fly Machine', muscleGroup: 'Shoulders' },

  // Arms
  { id: 'bicep-curl-machine', name: 'Bicep Curl Machine', muscleGroup: 'Arms' },
  { id: 'cable-bicep-curl', name: 'Cable Bicep Curl', muscleGroup: 'Arms' },
  { id: 'tricep-pushdown', name: 'Tricep Pushdown (Cable)', muscleGroup: 'Arms' },
  { id: 'tricep-extension-machine', name: 'Tricep Extension Machine', muscleGroup: 'Arms' },
  { id: 'preacher-curl-machine', name: 'Preacher Curl Machine', muscleGroup: 'Arms' },

  // Legs
  { id: 'leg-press', name: 'Leg Press', muscleGroup: 'Legs' },
  { id: 'leg-extension', name: 'Leg Extension', muscleGroup: 'Legs' },
  { id: 'leg-curl', name: 'Leg Curl (Seated)', muscleGroup: 'Legs' },
  { id: 'lying-leg-curl', name: 'Leg Curl (Lying)', muscleGroup: 'Legs' },
  { id: 'hack-squat', name: 'Hack Squat Machine', muscleGroup: 'Legs' },
  { id: 'hip-adductor', name: 'Hip Adductor Machine', muscleGroup: 'Legs' },
  { id: 'hip-abductor', name: 'Hip Abductor Machine', muscleGroup: 'Legs' },
  { id: 'calf-raise-machine', name: 'Calf Raise Machine', muscleGroup: 'Legs' },
  { id: 'smith-machine-squat', name: 'Smith Machine Squat', muscleGroup: 'Legs' },

  // Core
  { id: 'ab-crunch-machine', name: 'Ab Crunch Machine', muscleGroup: 'Core' },
  { id: 'cable-crunch', name: 'Cable Crunch', muscleGroup: 'Core' },
  { id: 'rotary-torso', name: 'Rotary Torso Machine', muscleGroup: 'Core' },
  { id: 'back-extension-machine', name: 'Back Extension Machine', muscleGroup: 'Core' },

  // Glutes
  { id: 'hip-thrust-machine', name: 'Hip Thrust Machine', muscleGroup: 'Glutes' },
  { id: 'cable-kickback', name: 'Cable Glute Kickback', muscleGroup: 'Glutes' },
  { id: 'glute-drive-machine', name: 'Glute Drive Machine', muscleGroup: 'Glutes' },
];

export const MUSCLE_GROUPS = [...new Set(EXERCISES.map(e => e.muscleGroup))];
