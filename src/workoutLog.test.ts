import { describe, expect, it } from 'vitest';
import { createWorkoutExercise, logWorkout, updateSetRecord } from './workoutLog';
import type { Exercise, WorkoutHistoryEntry, WorkoutState } from './types';

const exercise: Exercise = {
  id: 'chest-press',
  name: 'Chest Press Machine',
  muscleGroup: 'Chest',
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

describe('updateSetRecord', () => {
  it('updates reps, weight, RIR, and marks the set completed without mutating other sets', () => {
    const workout: WorkoutState = {
      date: '2026-05-29',
      exercises: [createWorkoutExercise(exercise, 2, 10, 85)],
    };

    const updated = updateSetRecord(workout, 0, 0, { reps: 9, weight: 90, rir: 2 });

    expect(updated.exercises[0].sets[0]).toEqual({ reps: 9, weight: 90, rir: 2, completed: true });
    expect(updated.exercises[0].sets[1]).toEqual({ reps: 10, weight: 85, rir: null, completed: false });
    expect(workout.exercises[0].sets[0]).toEqual({ reps: 10, weight: 85, rir: null, completed: false });
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
    };
    const existingHistory: WorkoutHistoryEntry[] = [
      {
        id: 'older-entry',
        date: '2026-05-28',
        loggedAt: '2026-05-28T18:00:00.000Z',
        exercises: [],
        totalSets: 0,
        completedSets: 0,
      },
    ];

    const history = logWorkout(workout, existingHistory, '2026-05-29T18:00:00.000Z');

    expect(history[0]).toMatchObject({
      id: '2026-05-29T18:00:00.000Z',
      date: '2026-05-29',
      loggedAt: '2026-05-29T18:00:00.000Z',
      totalSets: 2,
      completedSets: 1,
    });
    expect(history[0].exercises[0].targetWeight).toBe(90);
    expect(history[1].id).toBe('older-entry');
  });

  it('does not add an empty workout to history', () => {
    const emptyWorkout: WorkoutState = { date: '2026-05-29', exercises: [] };

    expect(logWorkout(emptyWorkout, [], '2026-05-29T18:00:00.000Z')).toEqual([]);
  });
});
