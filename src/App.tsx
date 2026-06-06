import { useCallback, useState } from 'react';
import { ExerciseSelector } from './components/ExerciseSelector';
import { WorkoutTracker } from './components/WorkoutTracker';
import { WorkoutHistory } from './components/WorkoutHistory';
import { RestTimer } from './components/RestTimer';
import { AuthScreen } from './components/AuthScreen';
import { WeeklyRoutines } from './components/WeeklyRoutines';
import { useLocalStorage } from './hooks/useLocalStorage';
import { createAccount, signIn } from './auth';
import { getUserStorageKeys } from './userStorage';
import { addRoutineToWorkout, createEmptyWeeklyRoutines, getTodayWeekday, normalizeWeeklyRoutines, replaceWorkoutWithRoutine } from './routines';
import { createCardioWorkoutExercise, createWorkoutExercise, getWorkoutTotals, logWorkout, updateSetRecord } from './workoutLog';
import type { AuthSession, CardioEquipment, DailyRoutine, WorkoutState, Exercise, UserAccount, WorkoutHistoryEntry } from './types';
import './App.css';

const today = new Date().toISOString().slice(0, 10);
const INITIAL: WorkoutState = { exercises: [], cardioExercises: [], date: today };

function normalizeWorkout(workout: WorkoutState): WorkoutState {
  return {
    ...workout,
    cardioExercises: (workout.cardioExercises ?? []).map(cardioExercise => ({
      ...cardioExercise,
      distanceMiles: cardioExercise.distanceMiles ?? 0,
    })),
  };
}

function AuthenticatedApp({ user, onSignOut }: { user: UserAccount; onSignOut: () => void }) {
  const [page, setPage] = useState<'main' | 'presets'>('main');
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [restTimerKey, setRestTimerKey] = useState(0);
  const storageKeys = getUserStorageKeys(user.id);
  const [workout, setWorkout] = useLocalStorage<WorkoutState>(storageKeys.workout, INITIAL);
  const [history, setHistory] = useLocalStorage<WorkoutHistoryEntry[]>(storageKeys.history, []);
  const [routines, setRoutines] = useLocalStorage(storageKeys.routines, createEmptyWeeklyRoutines());
  const [restTimerDefaultSeconds, setRestTimerDefaultSeconds] = useLocalStorage<number>(`fitness-tracker-rest-timer:${user.id}`, 90);

  const currentWorkout = workout.date === today ? normalizeWorkout(workout) : INITIAL;
  const weeklyRoutines = normalizeWeeklyRoutines(routines);
  const todayDay = getTodayWeekday();

  const addExercise = useCallback((exercise: Exercise, sets: number, reps: number, weight: number) => {
    setWorkout(prev => {
      const base = prev.date === today ? normalizeWorkout(prev) : INITIAL;
      return { ...base, exercises: [...base.exercises, createWorkoutExercise(exercise, sets, reps, weight)] };
    });
  }, [setWorkout]);

  const addCardioExercise = useCallback((equipment: CardioEquipment, durationMinutes: number, distanceMiles: number) => {
    setWorkout(prev => {
      const base = prev.date === today ? normalizeWorkout(prev) : INITIAL;
      return { ...base, cardioExercises: [...base.cardioExercises, createCardioWorkoutExercise(equipment, durationMinutes, distanceMiles)] };
    });
  }, [setWorkout]);

  const toggleSet = useCallback((exIdx: number, setIdx: number) => {
    setWorkout(prev => {
      const base = normalizeWorkout(prev);
      return {
        ...base,
        exercises: base.exercises.map((we, i) =>
          i !== exIdx ? we : { ...we, sets: we.sets.map((s, j) => j === setIdx ? { ...s, completed: !s.completed } : s) }
        ),
      };
    });
  }, [setWorkout]);

  const logSet = useCallback((exIdx: number, setIdx: number, reps: number, weight: number, rir: number | null) => {
    setWorkout(prev => updateSetRecord(normalizeWorkout(prev), exIdx, setIdx, { reps, weight, rir }));
    setShowRestTimer(true);
    setRestTimerKey(key => key + 1);
  }, [setWorkout]);

  const removeExercise = useCallback((exIdx: number) => {
    setWorkout(prev => {
      const base = normalizeWorkout(prev);
      return { ...base, exercises: base.exercises.filter((_, i) => i !== exIdx) };
    });
  }, [setWorkout]);

  const removeCardioExercise = useCallback((cardioIdx: number) => {
    setWorkout(prev => {
      const base = normalizeWorkout(prev);
      return { ...base, cardioExercises: base.cardioExercises.filter((_, i) => i !== cardioIdx) };
    });
  }, [setWorkout]);

  const clearWorkout = useCallback(() => {
    setWorkout({ exercises: [], cardioExercises: [], date: today });
  }, [setWorkout]);

  const handleLogWorkout = useCallback(() => {
    setHistory(prev => logWorkout(currentWorkout, prev));
    setWorkout({ exercises: [], cardioExercises: [], date: today });
  }, [currentWorkout, setHistory, setWorkout]);

  const saveRoutine = useCallback((routine: DailyRoutine) => {
    setRoutines(prev => ({ ...normalizeWeeklyRoutines(prev), [routine.day]: routine }));
  }, [setRoutines]);

  const addRoutine = useCallback((routine: DailyRoutine) => {
    setWorkout(prev => addRoutineToWorkout(routine, prev.date === today ? normalizeWorkout(prev) : INITIAL));
  }, [setWorkout]);

  const replaceWithRoutine = useCallback((routine: DailyRoutine) => {
    setWorkout(replaceWorkoutWithRoutine(routine, today));
  }, [setWorkout]);

  const { totalSets, completedSets, totalCardioMinutes, totalCardioMiles } = getWorkoutTotals(currentWorkout);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="header-left">
            <h1 className="app-title">FitTrack</h1>
            <button className="page-nav-btn" onClick={() => setPage(page === 'main' ? 'presets' : 'main')}>
              {page === 'main' ? '\u2699 Setup Presets' : '\u2190 Back to Workout'}
            </button>
          </div>
          <div className="user-menu">
            <span>Signed in as {user.name}</span>
            <button onClick={onSignOut}>Sign Out</button>
          </div>
          {page === 'main' && (totalSets > 0 || totalCardioMinutes > 0 || totalCardioMiles > 0) && (
            <div className="header-progress">
              {totalSets > 0 && <div className="progress-bar"><div className="progress-fill" style={{ width: `${(completedSets / totalSets) * 100}%` }} /></div>}
              <span className="progress-label">
                {totalSets > 0 ? `${completedSets}/${totalSets} sets` : ''}
                {totalSets > 0 && (totalCardioMinutes > 0 || totalCardioMiles > 0) ? ' \u00b7 ' : ''}
                {totalCardioMinutes > 0 ? `${totalCardioMinutes} min cardio` : ''}
                {totalCardioMinutes > 0 && totalCardioMiles > 0 ? ' \u00b7 ' : ''}
                {totalCardioMiles > 0 ? `${totalCardioMiles} mi` : ''}
              </span>
            </div>
          )}
        </div>
      </header>

      {page === 'main' ? (
        <main className="app-main">
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
          <ExerciseSelector onAdd={addExercise} onAddCardio={addCardioExercise} />
          <WorkoutHistory history={history} />
        </main>
      ) : (
        <main className="app-main">
          <WeeklyRoutines
            routines={weeklyRoutines}
            todayDay={todayDay}
            onSaveRoutine={saveRoutine}
            onAddRoutineToWorkout={addRoutine}
            onReplaceWorkoutWithRoutine={replaceWithRoutine}
          />
        </main>
      )}
      {showRestTimer && (
        <RestTimer
          modal
          autoStartKey={restTimerKey}
          initialSeconds={restTimerDefaultSeconds}
          onSaveDefault={setRestTimerDefaultSeconds}
          onClose={() => setShowRestTimer(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  const [accounts, setAccounts] = useLocalStorage<UserAccount[]>('fitness-tracker-accounts', []);
  const [session, setSession] = useLocalStorage<AuthSession | null>('fitness-tracker-session', null);
  const currentUser = accounts.find(account => account.id === session?.userId) ?? null;

  function handleCreateAccount(name: string, username: string, password: string) {
    const result = createAccount(accounts, { name, username, password });
    setAccounts(result.accounts);
    setSession({ userId: result.account.id });
  }

  function handleSignIn(username: string, password: string) {
    const account = signIn(accounts, { username, password });
    setSession({ userId: account.id });
  }

  if (!currentUser) {
    return <AuthScreen onCreateAccount={handleCreateAccount} onSignIn={handleSignIn} />;
  }

  return <AuthenticatedApp key={currentUser.id} user={currentUser} onSignOut={() => setSession(null)} />;
}
