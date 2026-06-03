import { describe, expect, it } from 'vitest';
import { addRoutineToWorkout, createEmptyWeeklyRoutines, replaceWorkoutWithRoutine, routineItemFromCardio, routineItemFromExercise } from './routines';
import type { WeeklyRoutines } from './types';

const chestPress = { id: 'chest-press-machine', name: 'Chest Press Machine', muscleGroup: 'Chest' };
const treadmill = { id: 'treadmill', name: 'Treadmill', category: 'Running / Walking', description: 'Run or walk.' };

describe('weekly routines', () => {
  it('creates one empty routine slot for each day of the week', () => {
    const routines = createEmptyWeeklyRoutines();

    expect(Object.keys(routines)).toEqual(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
    expect(routines.Monday).toEqual({ day: 'Monday', name: '', exercises: [], cardioExercises: [] });
  });

  it('turns selected strength and cardio settings into routine items', () => {
    expect(routineItemFromExercise(chestPress, 4, 8, 125)).toEqual({
      exercise: chestPress,
      targetSets: 4,
      targetReps: 8,
      targetWeight: 125,
    });

    expect(routineItemFromCardio(treadmill, 30, 2.5)).toEqual({
      equipment: treadmill,
      durationMinutes: 30,
      distanceMiles: 2.5,
    });
  });

  it('replaces today workout with a routine using fresh incomplete sets', () => {
    const routines: WeeklyRoutines = createEmptyWeeklyRoutines();
    routines.Monday = {
      day: 'Monday',
      name: 'Push Day',
      exercises: [routineItemFromExercise(chestPress, 2, 12, 75)],
      cardioExercises: [routineItemFromCardio(treadmill, 20, 1)],
    };

    const workout = replaceWorkoutWithRoutine(routines.Monday, '2026-06-08');

    expect(workout.date).toBe('2026-06-08');
    expect(workout.exercises).toHaveLength(1);
    expect(workout.exercises[0].sets).toEqual([
      { reps: 12, weight: 75, rir: null, completed: false },
      { reps: 12, weight: 75, rir: null, completed: false },
    ]);
    expect(workout.cardioExercises).toEqual([{ equipment: treadmill, durationMinutes: 20, distanceMiles: 1 }]);
  });

  it('adds a routine to an existing workout without replacing current items', () => {
    const routine = {
      day: 'Tuesday' as const,
      name: 'Cardio Day',
      exercises: [routineItemFromExercise(chestPress, 1, 10, 50)],
      cardioExercises: [routineItemFromCardio(treadmill, 10, 0.5)],
    };

    const existing = replaceWorkoutWithRoutine(routine, '2026-06-09');
    const updated = addRoutineToWorkout(routine, existing);

    expect(updated.exercises).toHaveLength(2);
    expect(updated.cardioExercises).toHaveLength(2);
    expect(updated.date).toBe('2026-06-09');
  });
});
