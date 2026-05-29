import type { WorkoutHistoryEntry } from '../types';

interface Props {
  history: WorkoutHistoryEntry[];
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function WorkoutHistory({ history }: Props) {
  return (
    <section className="workout-history">
      <h2 className="section-title">Workout History</h2>

      {history.length === 0 ? (
        <p className="history-empty">No logged workouts yet.</p>
      ) : (
        <div className="history-list">
          {history.map(entry => (
            <article key={entry.id} className="history-entry">
              <div className="history-entry-header">
                <div>
                  <h3>{formatDate(entry.date)}</h3>
                  <p>{entry.completedSets}/{entry.totalSets} sets completed</p>
                </div>
                <span>{entry.exercises.length} exercise{entry.exercises.length === 1 ? '' : 's'}</span>
              </div>

              <ul className="history-exercises">
                {entry.exercises.map((workoutExercise, index) => (
                  <li key={`${entry.id}-${workoutExercise.exercise.id}-${index}`}>
                    <strong>{workoutExercise.exercise.name}</strong>
                    <span>
                      {workoutExercise.targetSets} × {workoutExercise.targetReps} reps · {workoutExercise.targetWeight ?? 0} lb
                      {workoutExercise.sets.some(set => set.rir !== null) && ` · RIR ${workoutExercise.sets.find(set => set.rir !== null)?.rir}`}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
