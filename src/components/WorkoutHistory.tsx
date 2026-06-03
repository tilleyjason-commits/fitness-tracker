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
          {history.map(entry => {
            const cardioExercises = entry.cardioExercises ?? [];
            const totalCardioMinutes = entry.totalCardioMinutes ?? cardioExercises.reduce(
              (sum, cardioExercise) => sum + cardioExercise.durationMinutes,
              0,
            );
            const totalCardioMiles = entry.totalCardioMiles ?? cardioExercises.reduce(
              (sum, cardioExercise) => sum + (cardioExercise.distanceMiles ?? 0),
              0,
            );
            const totalExercises = entry.exercises.length + cardioExercises.length;

            return (
              <article key={entry.id} className="history-entry">
                <div className="history-entry-header">
                  <div>
                    <h3>{formatDate(entry.date)}</h3>
                    <p>
                      {entry.completedSets}/{entry.totalSets} sets completed
                      {totalCardioMinutes > 0 && ` · ${totalCardioMinutes} min cardio`}
                      {totalCardioMiles > 0 && ` · ${totalCardioMiles} mi`}
                    </p>
                  </div>
                  <span>{totalExercises} exercise{totalExercises === 1 ? '' : 's'}</span>
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
                  {cardioExercises.map((cardioExercise, index) => (
                    <li key={`${entry.id}-${cardioExercise.equipment.id}-${index}`}>
                      <strong>{cardioExercise.equipment.name}</strong>
                      <span>
                        {cardioExercise.durationMinutes} min
                        {(cardioExercise.distanceMiles ?? 0) > 0 && ` · ${cardioExercise.distanceMiles} mi`}
                        {' · '}{cardioExercise.equipment.category}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
