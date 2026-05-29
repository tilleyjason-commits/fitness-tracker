import type { WorkoutExercise } from '../types';

interface Props {
  exercises: WorkoutExercise[];
  onToggleSet: (exIdx: number, setIdx: number) => void;
  onRemoveExercise: (exIdx: number) => void;
  onClearWorkout: () => void;
  onLogWorkout: () => void;
}

export function WorkoutTracker({ exercises, onToggleSet, onRemoveExercise, onClearWorkout, onLogWorkout }: Props) {
  if (exercises.length === 0) {
    return (
      <div className="empty-workout">
        <div className="empty-icon">🏋️</div>
        <p>No exercises yet. Add one above to get started.</p>
      </div>
    );
  }

  return (
    <div className="workout-tracker">
      <div className="tracker-header">
        <h2 className="section-title">Today's Workout</h2>
        <div className="tracker-actions">
          <button className="log-btn" onClick={onLogWorkout}>Log Workout</button>
          <button className="clear-btn" onClick={onClearWorkout}>Clear All</button>
        </div>
      </div>

      {exercises.map((we, exIdx) => {
        const completedCount = we.sets.filter(s => s.completed).length;
        const allDone = completedCount === we.sets.length;

        return (
          <div key={`${we.exercise.id}-${exIdx}`} className={`exercise-card${allDone ? ' done' : ''}`}>
            <div className="exercise-card-header">
              <div>
                <span className="exercise-card-name">{we.exercise.name}</span>
                <span className="exercise-card-meta">
                  {we.targetSets} × {we.targetReps} reps · {we.targetWeight ?? 0} lb
                </span>
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
                  onClick={() => onToggleSet(exIdx, setIdx)}
                  aria-label={`Set ${setIdx + 1} ${set.completed ? 'completed' : 'incomplete'}`}
                >
                  <span className="set-num">Set {setIdx + 1}</span>
                  <span className="set-reps">{set.reps} reps</span>
                  <span className="set-weight">{set.weight ?? we.targetWeight ?? 0} lb</span>
                  {set.completed && <span className="check">✓</span>}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
