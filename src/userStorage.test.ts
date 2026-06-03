import { describe, expect, it } from 'vitest';
import { getUserStorageKeys } from './userStorage';

describe('userStorage', () => {
  it('uses distinct workout and history keys for each account', () => {
    expect(getUserStorageKeys('jason')).toEqual({
      workout: 'fitness-tracker-workout:jason',
      history: 'fitness-tracker-history:jason',
      routines: 'fitness-tracker-routines:jason',
    });

    expect(getUserStorageKeys('amanda')).toEqual({
      workout: 'fitness-tracker-workout:amanda',
      history: 'fitness-tracker-history:amanda',
      routines: 'fitness-tracker-routines:amanda',
    });
  });
});
