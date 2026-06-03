import type { CardioEquipment, CardioWorkoutExercise, Exercise, WorkoutExercise, WorkoutHistoryEntry, WorkoutState } from './types';

interface SetUpdate {
  reps: number;
  weight: number;
  rir: number | null;
}

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
    sets: Array.from({ length: sets }, () => ({ reps, weight, rir: null, completed: false })),
  };
}

export function createCardioWorkoutExercise(
  equipment: CardioEquipment,
  durationMinutes: number,
): CardioWorkoutExercise {
  return { equipment, durationMinutes };
}

export function updateSetRecord(
  workout: WorkoutState,
  exerciseIndex: number,
  setIndex: number,
  update: SetUpdate,
): WorkoutState {
  return {
    ...workout,
    exercises: workout.exercises.map((workoutExercise, exIdx) => {
      if (exIdx !== exerciseIndex) return workoutExercise;

      return {
        ...workoutExercise,
        sets: workoutExercise.sets.map((set, idx) => (
          idx === setIndex
            ? { ...set, ...update, completed: true }
            : set
        )),
      };
    }),
  };
}

export function getWorkoutTotals(workout: WorkoutState) {
  const totalSets = workout.exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0);
  const completedSets = workout.exercises.reduce(
    (sum, exercise) => sum + exercise.sets.filter(set => set.completed).length,
    0,
  );
  const totalCardioMinutes = (workout.cardioExercises ?? []).reduce(
    (sum, cardioExercise) => sum + cardioExercise.durationMinutes,
    0,
  );

  return { totalSets, completedSets, totalCardioMinutes };
}

export function logWorkout(
  workout: WorkoutState,
  history: WorkoutHistoryEntry[],
  loggedAt = new Date().toISOString(),
): WorkoutHistoryEntry[] {
  const cardioExercises = workout.cardioExercises ?? [];
  if (workout.exercises.length === 0 && cardioExercises.length === 0) return history;

  const totals = getWorkoutTotals(workout);
  const entry: WorkoutHistoryEntry = {
    ...workout,
    cardioExercises,
    id: loggedAt,
    loggedAt,
    totalSets: totals.totalSets,
    completedSets: totals.completedSets,
    totalCardioMinutes: totals.totalCardioMinutes,
  };

  return [entry, ...history];
}
