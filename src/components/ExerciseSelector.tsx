import { useState } from 'react';
import { EXERCISES, MUSCLE_GROUPS } from '../data/exercises';
import type { Exercise } from '../types';

interface Props {
  onAdd: (exercise: Exercise, sets: number, reps: number, weight: number) => void;
}

export function ExerciseSelector({ onAdd }: Props) {
  const [group, setGroup] = useState<string>(MUSCLE_GROUPS[0]);
  const [selected, setSelected] = useState<Exercise | null>(null);
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState(50);

  const filtered = EXERCISES.filter(e => e.muscleGroup === group);

  function handleAdd() {
    if (!selected) return;
    onAdd(selected, sets, reps, weight);
    setSelected(null);
  }

  return (
    <div className="exercise-selector">
      <h2 className="section-title">Add Exercise</h2>

      <div className="muscle-tabs">
        {MUSCLE_GROUPS.map(g => (
          <button
            key={g}
            className={`muscle-tab${group === g ? ' active' : ''}`}
            onClick={() => { setGroup(g); setSelected(null); }}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="exercise-list">
        {filtered.map(ex => (
          <button
            key={ex.id}
            className={`exercise-item${selected?.id === ex.id ? ' selected' : ''}`}
            onClick={() => setSelected(ex)}
          >
            {ex.name}
          </button>
        ))}
      </div>

      {selected && (
        <div className="sets-reps-row">
          <div className="num-input-group">
            <label>Sets</label>
            <div className="num-input">
              <button onClick={() => setSets(s => Math.max(1, s - 1))}>−</button>
              <span>{sets}</span>
              <button onClick={() => setSets(s => Math.min(20, s + 1))}>+</button>
            </div>
          </div>
          <div className="num-input-group">
            <label>Reps</label>
            <div className="num-input">
              <button onClick={() => setReps(r => Math.max(1, r - 1))}>−</button>
              <span>{reps}</span>
              <button onClick={() => setReps(r => Math.min(100, r + 1))}>+</button>
            </div>
          </div>
          <div className="num-input-group">
            <label>Weight</label>
            <div className="num-input">
              <button onClick={() => setWeight(w => Math.max(0, w - 5))}>−</button>
              <span>{weight} lb</span>
              <button onClick={() => setWeight(w => Math.min(999, w + 5))}>+</button>
            </div>
          </div>
          <button className="add-btn" onClick={handleAdd}>
            Add to Workout
          </button>
        </div>
      )}
    </div>
  );
}
