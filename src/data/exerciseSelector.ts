import { CARDIO_EQUIPMENT } from './cardioEquipment';
import { EXERCISES, MUSCLE_GROUPS } from './exercises';

export const CARDIO_GROUP = 'Cardio';
export const SELECTOR_GROUPS = [...MUSCLE_GROUPS, CARDIO_GROUP];

export function getSelectorItems(group: string) {
  if (group === CARDIO_GROUP) return CARDIO_EQUIPMENT;
  return EXERCISES.filter(exercise => exercise.muscleGroup === group);
}

export function isCardioGroup(group: string) {
  return group === CARDIO_GROUP;
}
