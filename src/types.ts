export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
}

export interface SetRecord {
  reps: number;
  weight: number;
  rir: number | null;
  completed: boolean;
}

export interface WorkoutExercise {
  exercise: Exercise;
  sets: SetRecord[];
  targetSets: number;
  targetReps: number;
  targetWeight: number;
}

export interface CardioEquipment {
  id: string;
  name: string;
  category: string;
  description: string;
}

export interface CardioWorkoutExercise {
  equipment: CardioEquipment;
  durationMinutes: number;
  distanceMiles: number;
}

export interface WorkoutState {
  exercises: WorkoutExercise[];
  cardioExercises: CardioWorkoutExercise[];
  date: string;
}

export interface WorkoutHistoryEntry extends WorkoutState {
  id: string;
  loggedAt: string;
  totalSets: number;
  completedSets: number;
  totalCardioMinutes: number;
  totalCardioMiles: number;
}

export type Weekday = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface RoutineExercise {
  exercise: Exercise;
  targetSets: number;
  targetReps: number;
  targetWeight: number;
}

export interface RoutineCardioExercise {
  equipment: CardioEquipment;
  durationMinutes: number;
  distanceMiles: number;
}

export interface DailyRoutine {
  day: Weekday;
  name: string;
  exercises: RoutineExercise[];
  cardioExercises: RoutineCardioExercise[];
}

export type WeeklyRoutines = Record<Weekday, DailyRoutine>;

export interface UserAccount {
  id: string;
  name: string;
  username: string;
  passwordHash: string;
  createdAt: string;
}

export interface AuthSession {
  userId: string;
}
