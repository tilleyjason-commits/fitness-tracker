import type { Exercise, WorkoutExercise, WorkoutHistoryEntry, WorkoutState } from './types';

export function createWorkoutExercise(
  exercise: Exercise,
  sets: number,
  reps: number,
  weight: number,
): WorkoutExercise {
  return {
    exercise,
    targetSets: sets,
    targetReps: reps,
    targetWeight: weight,
    sets: Array.from({ length: sets }, () => ({ reps, weight, completed: false })),
  };
}

export function getWorkoutTotals(workout: WorkoutState) {
  const totalSets = workout.exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0);
  const completedSets = workout.exercises.reduce(
    (sum, exercise) => sum + exercise.sets.filter(set => set.completed).length,
    0,
  );

  return { totalSets, completedSets };
}

export function logWorkout(
  workout: WorkoutState,
  history: WorkoutHistoryEntry[],
  loggedAt = new Date().toISOString(),
): WorkoutHistoryEntry[] {
  if (workout.exercises.length === 0) return history;

  const totals = getWorkoutTotals(workout);
  const entry: WorkoutHistoryEntry = {
    ...workout,
    id: loggedAt,
    loggedAt,
    totalSets: totals.totalSets,
    completedSets: totals.completedSets,
  };

  return [entry, ...history];
}
