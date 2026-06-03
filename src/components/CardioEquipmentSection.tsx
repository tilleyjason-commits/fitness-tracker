import { useState } from 'react';
import { CARDIO_EQUIPMENT } from '../data/cardioEquipment';
import type { CardioEquipment } from '../types';

interface Props {
  onAdd: (equipment: CardioEquipment, durationMinutes: number, distanceMiles: number) => void;
}

export function CardioEquipmentSection({ onAdd }: Props) {
  const [selected, setSelected] = useState<CardioEquipment | null>(null);
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [distanceMiles, setDistanceMiles] = useState(0);

  function handleAdd() {
    if (!selected) return;
    onAdd(selected, durationMinutes, distanceMiles);
    setSelected(null);
  }

  return (
    <section className="cardio-section">
      <div className="cardio-header">
        <div>
          <span className="eyebrow">Anytime Fitness</span>
          <h2 className="section-title">Add Cardio</h2>
        </div>
        <span className="cardio-count">{CARDIO_EQUIPMENT.length} options</span>
      </div>

      <p className="cardio-note">
        Select common cardio equipment you may find at Anytime Fitness, then choose your target duration and miles.
      </p>

      <div className="cardio-list">
        {CARDIO_EQUIPMENT.map(item => (
          <button
            key={item.id}
            className={`cardio-item${selected?.id === item.id ? ' selected' : ''}`}
            onClick={() => setSelected(item)}
          >
            <div>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
            </div>
            <span>{item.category}</span>
          </button>
        ))}
      </div>

      {selected && (
        <div className="sets-reps-row cardio-add-row">
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
          <button className="add-btn" onClick={handleAdd}>
            Add Cardio
          </button>
        </div>
      )}
    </section>
  );
}
