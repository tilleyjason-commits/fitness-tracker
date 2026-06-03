import { useCallback } from 'react';
import { ExerciseSelector } from './components/ExerciseSelector';
import { WorkoutTracker } from './components/WorkoutTracker';
import { WorkoutHistory } from './components/WorkoutHistory';
import { RestTimer } from './components/RestTimer';
import { CardioEquipmentSection } from './components/CardioEquipmentSection';
import { useLocalStorage } from './hooks/useLocalStorage';
import { createCardioWorkoutExercise, createWorkoutExercise, getWorkoutTotals, logWorkout, updateSetRecord } from './workoutLog';
import type { CardioEquipment, WorkoutState, Exercise, WorkoutHistoryEntry } from './types';
import './App.css';

const today = new Date().toISOString().slice(0, 10);
const INITIAL: WorkoutState = { exercises: [], cardioExercises: [], date: today };

function normalizeWorkout(workout: WorkoutState): WorkoutState {
  return {
    ...workout,
    cardioExercises: workout.cardioExercises ?? [],
  };
}

export default function App() {
  const [workout, setWorkout] = useLocalStorage<WorkoutState>('fitness-tracker-workout', INITIAL);
  const [history, setHistory] = useLocalStorage<WorkoutHistoryEntry[]>('fitness-tracker-history', []);

  const currentWorkout = workout.date === today ? normalizeWorkout(workout) : INITIAL;

  const addExercise = useCallback((exercise: Exercise, sets: number, reps: number, weight: number) => {
    setWorkout(prev => {
      const base = prev.date === today ? normalizeWorkout(prev) : INITIAL;
      return {
        ...base,
        exercises: [
          ...base.exercises,
          createWorkoutExercise(exercise, sets, reps, weight),
        ],
      };
    });
  }, [setWorkout]);

  const addCardioExercise = useCallback((equipment: CardioEquipment, durationMinutes: number) => {
    setWorkout(prev => {
      const base = prev.date === today ? normalizeWorkout(prev) : INITIAL;
      return {
        ...base,
        cardioExercises: [
          ...base.cardioExercises,
          createCardioWorkoutExercise(equipment, durationMinutes),
        ],
      };
    });
  }, [setWorkout]);

  const toggleSet = useCallback((exIdx: number, setIdx: number) => {
    setWorkout(prev => {
      const base = normalizeWorkout(prev);
      const exercises = base.exercises.map((we, i) => {
        if (i !== exIdx) return we;
        return {
          ...we,
          sets: we.sets.map((s, j) =>
            j === setIdx ? { ...s, completed: !s.completed } : s
          ),
        };
      });
      return { ...base, exercises };
    });
  }, [setWorkout]);

  const logSet = useCallback((exIdx: number, setIdx: number, reps: number, weight: number, rir: number | null) => {
    setWorkout(prev => updateSetRecord(normalizeWorkout(prev), exIdx, setIdx, { reps, weight, rir }));
  }, [setWorkout]);

  const removeExercise = useCallback((exIdx: number) => {
    setWorkout(prev => {
      const base = normalizeWorkout(prev);
      return {
        ...base,
        exercises: base.exercises.filter((_, i) => i !== exIdx),
      };
    });
  }, [setWorkout]);

  const removeCardioExercise = useCallback((cardioIdx: number) => {
    setWorkout(prev => {
      const base = normalizeWorkout(prev);
      return {
        ...base,
        cardioExercises: base.cardioExercises.filter((_, i) => i !== cardioIdx),
      };
    });
  }, [setWorkout]);

  const clearWorkout = useCallback(() => {
    setWorkout({ exercises: [], cardioExercises: [], date: today });
  }, [setWorkout]);

  const handleLogWorkout = useCallback(() => {
    setHistory(prev => logWorkout(currentWorkout, prev));
    setWorkout({ exercises: [], cardioExercises: [], date: today });
  }, [currentWorkout, setHistory, setWorkout]);

  const { totalSets, completedSets, totalCardioMinutes } = getWorkoutTotals(currentWorkout);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <h1 className="app-title">FitTrack</h1>
          {(totalSets > 0 || totalCardioMinutes > 0) && (
            <div className="header-progress">
              {totalSets > 0 && (
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${(completedSets / totalSets) * 100}%` }} />
                </div>
              )}
              <span className="progress-label">
                {totalSets > 0 ? `${completedSets}/${totalSets} sets` : ''}
                {totalSets > 0 && totalCardioMinutes > 0 ? ' · ' : ''}
                {totalCardioMinutes > 0 ? `${totalCardioMinutes} min cardio` : ''}
              </span>
            </div>
          )}
        </div>
      </header>

      <main className="app-main">
        <ExerciseSelector onAdd={addExercise} />
        <CardioEquipmentSection onAdd={addCardioExercise} />
        <WorkoutTracker
          exercises={currentWorkout.exercises}
          cardioExercises={currentWorkout.cardioExercises}
          onToggleSet={toggleSet}
          onLogSet={logSet}
          onRemoveExercise={removeExercise}
          onRemoveCardioExercise={removeCardioExercise}
          onClearWorkout={clearWorkout}
          onLogWorkout={handleLogWorkout}
        />
        <RestTimer />
        <WorkoutHistory history={history} />
      </main>
    </div>
  );
}
