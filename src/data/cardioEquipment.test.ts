import { describe, expect, it } from 'vitest';
import { CARDIO_EQUIPMENT } from './cardioEquipment';

describe('CARDIO_EQUIPMENT', () => {
  it('lists the common Anytime Fitness cardio equipment options', () => {
    const names = CARDIO_EQUIPMENT.map(item => item.name);

    expect(names).toEqual(expect.arrayContaining([
      'Treadmill',
      'Elliptical Cross-Trainer',
      'Upright Bike',
      'Recumbent Bike',
      'Spin Bike',
      'Stair Climber',
      'Rowing Machine',
    ]));
  });

  it('includes enough detail to render a standalone cardio section', () => {
    expect(CARDIO_EQUIPMENT.length).toBeGreaterThanOrEqual(10);
    expect(CARDIO_EQUIPMENT.every(item => item.id && item.name && item.category && item.description)).toBe(true);
  });
});
