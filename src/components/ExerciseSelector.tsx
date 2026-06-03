import { useState } from 'react';
import { SELECTOR_GROUPS, getSelectorItems, isCardioGroup } from '../data/exerciseSelector';
import type { CardioEquipment, Exercise } from '../types';

interface Props {
  onAdd: (exercise: Exercise, sets: number, reps: number, weight: number) => void;
  onAddCardio: (equipment: CardioEquipment, durationMinutes: number, distanceMiles: number) => void;
  title?: string;
  addLabel?: string;
}

export function ExerciseSelector({ onAdd, onAddCardio, title = 'Add Exercise', addLabel = 'Add to Workout' }: Props) {
  const [group, setGroup] = useState<string>(SELECTOR_GROUPS[0]);
  const [selected, setSelected] = useState<Exercise | CardioEquipment | null>(null);
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState(50);
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [distanceMiles, setDistanceMiles] = useState(0);

  const cardioMode = isCardioGroup(group);
  const filtered = getSelectorItems(group);

  function handleAdd() {
    if (!selected) return;

    if (cardioMode) {
      onAddCardio(selected as CardioEquipment, durationMinutes, distanceMiles);
    } else {
      onAdd(selected as Exercise, sets, reps, weight);
    }

    setSelected(null);
  }

  return (
    <div className="exercise-selector">
      <h2 className="section-title">{title}</h2>

      <div className="muscle-tabs">
        {SELECTOR_GROUPS.map(g => (
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
        {filtered.map(item => (
          <button
            key={item.id}
            className={`exercise-item${selected?.id === item.id ? ' selected' : ''}`}
            onClick={() => setSelected(item)}
          >
            {item.name}
          </button>
        ))}
      </div>

      {selected && (
        <div className="sets-reps-row">
          {cardioMode ? (
            <>
              <div className="num-input-group">
                <label>Duration</label>
                <div className="num-input">
                  <button onClick={() => setDurationMinutes(value => Math.max(5, value - 5))}>−</button>
                  <span>{durationMinutes} min</span>
                  <button onClick={() => setDurationMinutes(value => Math.min(240, value + 5))}>+</button>
                </div>
              </div>
              <div className="num-input-group">
                <label>Miles</label>
                <div className="num-input">
                  <button onClick={() => setDistanceMiles(value => Math.max(0, Number((value - 0.25).toFixed(2))))}>−</button>
                  <span>{distanceMiles} mi</span>
                  <button onClick={() => setDistanceMiles(value => Math.min(50, Number((value + 0.25).toFixed(2))))}>+</button>
                </div>
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
          <button className="add-btn" onClick={handleAdd}>
            {addLabel}
          </button>
        </div>
      )}
    </div>
  );
}
