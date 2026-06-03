import { createCardioWorkoutExercise, createWorkoutExercise } from './workoutLog';
import type { CardioEquipment, DailyRoutine, Exercise, RoutineCardioExercise, RoutineExercise, Weekday, WeeklyRoutines, WorkoutState } from './types';

export const WEEKDAYS: Weekday[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function getTodayWeekday(date = new Date()): Weekday {
  const day = date.getDay();
  return WEEKDAYS[(day + 6) % 7];
}

export function createEmptyWeeklyRoutines(): WeeklyRoutines {
  return WEEKDAYS.reduce((routines, day) => {
    routines[day] = { day, name: '', exercises: [], cardioExercises: [] };
    return routines;
  }, {} as WeeklyRoutines);
}

export function normalizeWeeklyRoutines(routines?: Partial<WeeklyRoutines>): WeeklyRoutines {
  const empty = createEmptyWeeklyRoutines();
  if (!routines) return empty;

  return WEEKDAYS.reduce((normalized, day) => {
    const routine = routines[day];
    normalized[day] = {
      day,
      name: routine?.name ?? '',
      exercises: routine?.exercises ?? [],
      cardioExercises: routine?.cardioExercises ?? [],
    };
    return normalized;
  }, {} as WeeklyRoutines);
}

export function routineItemFromExercise(
  exercise: Exercise,
  targetSets: number,
  targetReps: number,
  targetWeight: number,
): RoutineExercise {
  return { exercise, targetSets, targetReps, targetWeight };
}

export function routineItemFromCardio(
  equipment: CardioEquipment,
  durationMinutes: number,
  distanceMiles: number,
): RoutineCardioExercise {
  return { equipment, durationMinutes, distanceMiles };
}

export function routineHasItems(routine: DailyRoutine): boolean {
  return routine.exercises.length > 0 || routine.cardioExercises.length > 0;
}

function routineToWorkoutItems(routine: DailyRoutine) {
  return {
    exercises: routine.exercises.map(item => createWorkoutExercise(
      item.exercise,
      item.targetSets,
      item.targetReps,
      item.targetWeight,
    )),
    cardioExercises: routine.cardioExercises.map(item => createCardioWorkoutExercise(
      item.equipment,
      item.durationMinutes,
      item.distanceMiles,
    )),
  };
}

export function replaceWorkoutWithRoutine(routine: DailyRoutine, date: string): WorkoutState {
  return {
    ...routineToWorkoutItems(routine),
    date,
  };
}

export function addRoutineToWorkout(routine: DailyRoutine, workout: WorkoutState): WorkoutState {
  const items = routineToWorkoutItems(routine);
  return {
    ...workout,
    exercises: [...workout.exercises, ...items.exercises],
    cardioExercises: [...(workout.cardioExercises ?? []), ...items.cardioExercises],
  };
}
