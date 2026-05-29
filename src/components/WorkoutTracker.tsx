import { useState } from 'react';
import type { WorkoutExercise } from '../types';

interface Props {
  exercises: WorkoutExercise[];
  onToggleSet: (exIdx: number, setIdx: number) => void;
  onLogSet: (exIdx: number, setIdx: number, reps: number, weight: number, rir: number | null) => void;
  onRemoveExercise: (exIdx: number) => void;
  onClearWorkout: () => void;
  onLogWorkout: () => void;
}

interface ActiveSet {
  exIdx: number;
  setIdx: number;
}

export function WorkoutTracker({ exercises, onToggleSet, onLogSet, onRemoveExercise, onClearWorkout, onLogWorkout }: Props) {
  const [activeSet, setActiveSet] = useState<ActiveSet | null>(null);
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState(50);
  const [rir, setRir] = useState(2);

  function openSetLogger(exIdx: number, setIdx: number) {
    const set = exercises[exIdx].sets[setIdx];
    setActiveSet({ exIdx, setIdx });
    setReps(set.reps);
    setWeight(set.weight ?? exercises[exIdx].targetWeight ?? 0);
    setRir(set.rir ?? 2);
  }

  function handleLogSet() {
    if (!activeSet) return;
    onLogSet(activeSet.exIdx, activeSet.setIdx, reps, weight, rir);
    setActiveSet(null);
  }

  if (exercises.length === 0) {
    return (
      <div className="empty-workout">
        <div className="empty-icon">🏋️</div>
        <p>No exercises yet. Add one above to get started.</p>
      </div>
    );
  }

  const activeExercise = activeSet ? exercises[activeSet.exIdx] : null;

  return (
    <div className="workout-tracker">
      <div className="tracker-header">
        <div>
          <span className="eyebrow">Training now</span>
          <h2 className="section-title">Today's Workout</h2>
        </div>
        <div className="tracker-actions">
          <button className="log-btn" onClick={onLogWorkout}>Finish Workout</button>
          <button className="clear-btn" onClick={onClearWorkout}>Clear All</button>
        </div>
      </div>

      {exercises.map((we, exIdx) => {
        const completedCount = we.sets.filter(s => s.completed).length;
        const allDone = completedCount === we.sets.length;

        return (
          <div key={`${we.exercise.id}-${exIdx}`} className={`exercise-card${allDone ? ' done' : ''}`}>
            <div className="exercise-card-header">
              <div className="exercise-title-row">
                <span className="exercise-number">{exIdx + 1}</span>
                <div>
                  <span className="exercise-card-name">{we.exercise.name}</span>
                  <span className="exercise-card-meta">
                    {we.exercise.muscleGroup} · {we.targetSets} × {we.targetReps} · {we.targetWeight ?? 0} lb
                  </span>
                </div>
              </div>
              <div className="exercise-card-actions">
                <span className="set-progress">{completedCount}/{we.sets.length}</span>
                <button className="remove-btn" onClick={() => onRemoveExercise(exIdx)} aria-label="Remove">✕</button>
              </div>
            </div>

            <div className="sets-grid">
              {we.sets.map((set, setIdx) => (
                <button
                  key={setIdx}
                  className={`set-bubble${set.completed ? ' completed' : ''}`}
                  onClick={() => openSetLogger(exIdx, setIdx)}
                  onDoubleClick={() => onToggleSet(exIdx, setIdx)}
                  aria-label={`Set ${setIdx + 1} ${set.completed ? 'completed' : 'incomplete'}`}
                >
                  <span className="set-num">Set {setIdx + 1}</span>
                  <span className="set-reps">{set.reps} reps</span>
                  <span className="set-weight">{set.weight ?? we.targetWeight ?? 0} lb</span>
                  <span className="set-rir">RIR {set.rir ?? '—'}</span>
                  {set.completed && <span className="check">✓</span>}
                </button>
              ))}
            </div>
          </div>
        );
      })}

      {activeSet && activeExercise && (
        <div className="set-logger" role="dialog" aria-label="Log set">
          <div className="set-logger-card">
            <div className="set-logger-header">
              <div>
                <span className="eyebrow">Log Set {activeSet.setIdx + 1}</span>
                <h3>{activeExercise.exercise.name}</h3>
              </div>
              <button className="remove-btn" onClick={() => setActiveSet(null)} aria-label="Close">✕</button>
            </div>

            <div className="set-logger-grid">
              <div className="num-input-group">
                <label>Reps</label>
                <div className="num-input compact">
                  <button onClick={() => setReps(value => Math.max(0, value - 1))}>−</button>
                  <span>{reps}</span>
                  <button onClick={() => setReps(value => Math.min(100, value + 1))}>+</button>
                </div>
              </div>
              <div className="num-input-group">
                <label>Weight</label>
                <div className="num-input compact">
                  <button onClick={() => setWeight(value => Math.max(0, value - 5))}>−</button>
                  <span>{weight} lb</span>
                  <button onClick={() => setWeight(value => Math.min(999, value + 5))}>+</button>
                </div>
              </div>
              <div className="num-input-group">
                <label>RIR</label>
                <div className="num-input compact">
                  <button onClick={() => setRir(value => Math.max(0, value - 1))}>−</button>
                  <span>{rir}</span>
                  <button onClick={() => setRir(value => Math.min(10, value + 1))}>+</button>
                </div>
              </div>
            </div>

            <button className="add-btn logger-submit" onClick={handleLogSet}>Log Set</button>
          </div>
        </div>
      )}
    </div>
  );
}
