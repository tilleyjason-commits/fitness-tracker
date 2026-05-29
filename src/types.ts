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

export interface WorkoutState {
  exercises: WorkoutExercise[];
  date: string;
}

export interface WorkoutHistoryEntry extends WorkoutState {
  id: string;
  loggedAt: string;
  totalSets: number;
  completedSets: number;
}
