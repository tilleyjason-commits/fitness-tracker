import { describe, expect, it } from 'vitest';
import { CARDIO_EQUIPMENT } from './cardioEquipment';
import { EXERCISES } from './exercises';
import { SELECTOR_GROUPS, getSelectorItems } from './exerciseSelector';

describe('unified exercise selector data', () => {
  it('adds cardio as a selectable tab after the strength muscle groups', () => {
    expect(SELECTOR_GROUPS.at(-1)).toBe('Cardio');
    expect(SELECTOR_GROUPS).toContain('Chest');
  });

  it('returns strength exercises for muscle group tabs', () => {
    expect(getSelectorItems('Chest')).toEqual(
      EXERCISES.filter(exercise => exercise.muscleGroup === 'Chest'),
    );
  });

  it('returns cardio equipment for the cardio tab', () => {
    expect(getSelectorItems('Cardio')).toEqual(CARDIO_EQUIPMENT);
  });
});
