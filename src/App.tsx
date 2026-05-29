import { useCallback } from 'react';
import { ExerciseSelector } from './components/ExerciseSelector';
import { WorkoutTracker } from './components/WorkoutTracker';
import { RestTimer } from './components/RestTimer';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { WorkoutState, Exercise } from './types';
import './App.css';

const today = new Date().toISOString().slice(0, 10);
const INITIAL: WorkoutState = { exercises: [], date: today };

export default function App() {
  const [workout, setWorkout] = useLocalStorage<WorkoutState>('fitness-tracker-workout', INITIAL);

  const currentWorkout = workout.date === today ? workout : INITIAL;

  const addExercise = useCallback((exercise: Exercise, sets: number, reps: number) => {
    setWorkout(prev => {
      const base = prev.date === today ? prev : INITIAL;
      return {
        ...base,
        exercises: [
          ...base.exercises,
          {
            exercise,
            targetSets: sets,
            targetReps: reps,
            sets: Array.from({ length: sets }, () => ({ reps, completed: false })),
          },
        ],
      };
    });
  }, [setWorkout]);

  const toggleSet = useCallback((exIdx: number, setIdx: number) => {
    setWorkout(prev => {
      const exercises = prev.exercises.map((we, i) => {
        if (i !== exIdx) return we;
        return {
          ...we,
          sets: we.sets.map((s, j) =>
            j === setIdx ? { ...s, completed: !s.completed } : s
          ),
        };
      });
      return { ...prev, exercises };
    });
  }, [setWorkout]);

  const removeExercise = useCallback((exIdx: number) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== exIdx),
    }));
  }, [setWorkout]);

  const clearWorkout = useCallback(() => {
    setWorkout({ exercises: [], date: today });
  }, [setWorkout]);

  const totalSets = currentWorkout.exercises.reduce((a, e) => a + e.sets.length, 0);
  const completedSets = currentWorkout.exercises.reduce((a, e) => a + e.sets.filter(s => s.completed).length, 0);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <h1 className="app-title">FitTrack</h1>
          {totalSets > 0 && (
            <div className="header-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(completedSets / totalSets) * 100}%` }} />
              </div>
              <span className="progress-label">{completedSets}/{totalSets} sets</span>
            </div>
          )}
        </div>
      </header>

      <main className="app-main">
        <ExerciseSelector onAdd={addExercise} />
        <WorkoutTracker
          exercises={currentWorkout.exercises}
          onToggleSet={toggleSet}
          onRemoveExercise={removeExercise}
          onClearWorkout={clearWorkout}
        />
        <RestTimer />
      </main>
    </div>
  );
}
