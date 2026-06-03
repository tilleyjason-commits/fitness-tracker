import { describe, expect, it } from 'vitest';
import {
  createCardioWorkoutExercise,
  createWorkoutExercise,
  getWorkoutTotals,
  logWorkout,
  updateSetRecord,
} from './workoutLog';
import type { CardioEquipment, Exercise, WorkoutHistoryEntry, WorkoutState } from './types';

const exercise: Exercise = {
  id: 'chest-press',
  name: 'Chest Press Machine',
  muscleGroup: 'Chest',
};

const cardio: CardioEquipment = {
  id: 'treadmill',
  name: 'Treadmill',
  category: 'Running / Walking',
  description: 'Motorized walking, jogging, and running with speed and incline controls.',
};

describe('createWorkoutExercise', () => {
  it('stores the selected weight on the exercise and every planned set', () => {
    const workoutExercise = createWorkoutExercise(exercise, 3, 10, 85);

    expect(workoutExercise.targetWeight).toBe(85);
    expect(workoutExercise.sets).toEqual([
      { reps: 10, weight: 85, rir: null, completed: false },
      { reps: 10, weight: 85, rir: null, completed: false },
      { reps: 10, weight: 85, rir: null, completed: false },
    ]);
  });
});

describe('createCardioWorkoutExercise', () => {
  it('stores the selected cardio equipment, target duration, and target miles', () => {
    expect(createCardioWorkoutExercise(cardio, 30, 2.5)).toEqual({
      equipment: cardio,
      durationMinutes: 30,
      distanceMiles: 2.5,
    });
  });
});

describe('updateSetRecord', () => {
  it('updates reps, weight, RIR, and marks the set completed without mutating other sets', () => {
    const workout: WorkoutState = {
      date: '2026-05-29',
      exercises: [createWorkoutExercise(exercise, 2, 10, 85)],
      cardioExercises: [],
    };

    const updated = updateSetRecord(workout, 0, 0, { reps: 9, weight: 90, rir: 2 });

    expect(updated.exercises[0].sets[0]).toEqual({ reps: 9, weight: 90, rir: 2, completed: true });
    expect(updated.exercises[0].sets[1]).toEqual({ reps: 10, weight: 85, rir: null, completed: false });
    expect(workout.exercises[0].sets[0]).toEqual({ reps: 10, weight: 85, rir: null, completed: false });
  });
});

describe('getWorkoutTotals', () => {
  it('includes cardio duration and mile totals alongside strength set totals', () => {
    const workout: WorkoutState = {
      date: '2026-05-29',
      exercises: [createWorkoutExercise(exercise, 2, 10, 85)],
      cardioExercises: [createCardioWorkoutExercise(cardio, 30, 2.5)],
    };

    expect(getWorkoutTotals(workout)).toEqual({
      totalSets: 2,
      completedSets: 0,
      totalCardioMinutes: 30,
      totalCardioMiles: 2.5,
    });
  });
});

describe('logWorkout', () => {
  it('adds a completed workout snapshot to the top of the history log', () => {
    const workout: WorkoutState = {
      date: '2026-05-29',
      exercises: [
        {
          exercise,
          targetSets: 2,
          targetReps: 8,
          targetWeight: 90,
          sets: [
            { reps: 8, weight: 90, rir: 1, completed: true },
            { reps: 8, weight: 90, rir: null, completed: false },
          ],
        },
      ],
      cardioExercises: [],
    };
    const existingHistory: WorkoutHistoryEntry[] = [
      {
        id: 'older-entry',
        date: '2026-05-28',
        loggedAt: '2026-05-28T18:00:00.000Z',
        exercises: [],
        cardioExercises: [],
        totalSets: 0,
        completedSets: 0,
        totalCardioMinutes: 0,
        totalCardioMiles: 0,
      },
    ];

    const history = logWorkout(workout, existingHistory, '2026-05-29T18:00:00.000Z');

    expect(history[0]).toMatchObject({
      id: '2026-05-29T18:00:00.000Z',
      date: '2026-05-29',
      loggedAt: '2026-05-29T18:00:00.000Z',
      totalSets: 2,
      completedSets: 1,
      totalCardioMinutes: 0,
      totalCardioMiles: 0,
    });
    expect(history[0].exercises[0].targetWeight).toBe(90);
    expect(history[1].id).toBe('older-entry');
  });

  it('adds cardio-only workouts to history', () => {
    const workout: WorkoutState = {
      date: '2026-05-29',
      exercises: [],
      cardioExercises: [createCardioWorkoutExercise(cardio, 25, 1.75)],
    };

    const history = logWorkout(workout, [], '2026-05-29T18:00:00.000Z');

    expect(history[0]).toMatchObject({
      cardioExercises: [{ equipment: cardio, durationMinutes: 25, distanceMiles: 1.75 }],
      totalSets: 0,
      completedSets: 0,
      totalCardioMinutes: 25,
      totalCardioMiles: 1.75,
    });
  });

  it('does not add an empty workout to history', () => {
    const emptyWorkout: WorkoutState = { date: '2026-05-29', exercises: [], cardioExercises: [] };

    expect(logWorkout(emptyWorkout, [], '2026-05-29T18:00:00.000Z')).toEqual([]);
  });
});
