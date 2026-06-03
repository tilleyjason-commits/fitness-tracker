import { useCallback } from 'react';
import { ExerciseSelector } from './components/ExerciseSelector';
import { WorkoutTracker } from './components/WorkoutTracker';
import { WorkoutHistory } from './components/WorkoutHistory';
import { RestTimer } from './components/RestTimer';
import { CardioEquipmentSection } from './components/CardioEquipmentSection';
import { useLocalStorage } from './hooks/useLocalStorage';
import { createWorkoutExercise, getWorkoutTotals, logWorkout, updateSetRecord } from './workoutLog';
import type { WorkoutState, Exercise, WorkoutHistoryEntry } from './types';
import './App.css';

const today = new Date().toISOString().slice(0, 10);
const INITIAL: WorkoutState = { exercises: [], date: today };

export default function App() {
  const [workout, setWorkout] = useLocalStorage<WorkoutState>('fitness-tracker-workout', INITIAL);
  const [history, setHistory] = useLocalStorage<WorkoutHistoryEntry[]>('fitness-tracker-history', []);

  const currentWorkout = workout.date === today ? workout : INITIAL;

  const addExercise = useCallback((exercise: Exercise, sets: number, reps: number, weight: number) => {
    setWorkout(prev => {
      const base = prev.date === today ? prev : INITIAL;
      return {
        ...base,
        exercises: [
          ...base.exercises,
          createWorkoutExercise(exercise, sets, reps, weight),
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

  const logSet = useCallback((exIdx: number, setIdx: number, reps: number, weight: number, rir: number | null) => {
    setWorkout(prev => updateSetRecord(prev, exIdx, setIdx, { reps, weight, rir }));
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

  const handleLogWorkout = useCallback(() => {
    setHistory(prev => logWorkout(currentWorkout, prev));
    setWorkout({ exercises: [], date: today });
  }, [currentWorkout, setHistory, setWorkout]);

  const { totalSets, completedSets } = getWorkoutTotals(currentWorkout);

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
          onLogSet={logSet}
          onRemoveExercise={removeExercise}
          onClearWorkout={clearWorkout}
          onLogWorkout={handleLogWorkout}
        />
        <RestTimer />
        <CardioEquipmentSection />
        <WorkoutHistory history={history} />
      </main>
    </div>
  );
}
