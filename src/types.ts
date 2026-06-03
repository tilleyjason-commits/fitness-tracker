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
}
