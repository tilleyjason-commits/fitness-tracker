export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
}

export interface SetRecord {
  reps: number;
  completed: boolean;
}

export interface WorkoutExercise {
  exercise: Exercise;
  sets: SetRecord[];
  targetSets: number;
  targetReps: number;
}

export interface WorkoutState {
  exercises: WorkoutExercise[];
  date: string;
}
