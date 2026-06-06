import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WorkoutHistory } from './WorkoutHistory';
import type { WorkoutHistoryEntry } from '../types';

const emptyEntry: WorkoutHistoryEntry = {
  id: 'entry-1',
  date: '2026-06-01',
  loggedAt: '2026-06-01T10:00:00.000Z',
  exercises: [],
  cardioExercises: [],
  totalSets: 0,
  completedSets: 0,
  totalCardioMinutes: 0,
  totalCardioMiles: 0,
};

const fullEntry: WorkoutHistoryEntry = {
  id: 'entry-2',
  date: '2026-06-02',
  loggedAt: '2026-06-02T10:00:00.000Z',
  exercises: [
    {
      exercise: { id: 'chest-press', name: 'Chest Press Machine', muscleGroup: 'Chest' },
      targetSets: 3,
      targetReps: 10,
      targetWeight: 85,
      sets: [
        { reps: 10, weight: 85, rir: null, completed: true },
        { reps: 10, weight: 85, rir: null, completed: true },
        { reps: 10, weight: 85, rir: 1, completed: true },
      ],
    },
  ],
  cardioExercises: [
    {
      equipment: { id: 'treadmill', name: 'Treadmill', category: 'Running / Walking', description: '...' },
      durationMinutes: 30,
      distanceMiles: 2.5,
    },
  ],
  totalSets: 3,
  completedSets: 3,
  totalCardioMinutes: 30,
  totalCardioMiles: 2.5,
};

describe('WorkoutHistory', () => {
  it('shows empty state when no history exists', () => {
    render(<WorkoutHistory history={[]} />);
    expect(screen.getByText('No logged workouts yet.')).toBeInTheDocument();
  });

  it('renders a history entry with strength and cardio', () => {
    render(<WorkoutHistory history={[fullEntry]} />);
    expect(screen.getByText('Chest Press Machine')).toBeInTheDocument();
    expect(screen.getByText('Treadmill')).toBeInTheDocument();
    expect(screen.getByText((c) => c.includes('30 min cardio'))).toBeInTheDocument();
    // 2.5 mi appears in both the header summary and the exercise detail span
    const mileMatches = screen.getAllByText((c) => c.includes('2.5'));
    expect(mileMatches.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText((c) => c.includes('3/3 sets completed'))).toBeInTheDocument();
  });

  it('renders an empty workout entry gracefully', () => {
    render(<WorkoutHistory history={[emptyEntry]} />);
    expect(screen.getByText((c) => c.includes('0/0 sets completed'))).toBeInTheDocument();
  });
});
