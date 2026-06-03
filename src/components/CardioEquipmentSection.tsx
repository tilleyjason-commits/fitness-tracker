import { CARDIO_EQUIPMENT } from '../data/cardioEquipment';

export function CardioEquipmentSection() {
  return (
    <section className="cardio-section">
      <div className="cardio-header">
        <div>
          <span className="eyebrow">Anytime Fitness</span>
          <h2 className="section-title">Cardio Equipment</h2>
        </div>
        <span className="cardio-count">{CARDIO_EQUIPMENT.length} options</span>
      </div>

      <p className="cardio-note">
        Common cardio machines you may find at Anytime Fitness. Equipment varies by club.
      </p>

      <div className="cardio-list">
        {CARDIO_EQUIPMENT.map(item => (
          <article key={item.id} className="cardio-item">
            <div>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
            </div>
            <span>{item.category}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
