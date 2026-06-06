import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WorkoutTracker } from './WorkoutTracker';
import type { Exercise, WorkoutExercise } from '../types';

const exercise: Exercise = {
  id: 'chest-press',
  name: 'Chest Press Machine',
  muscleGroup: 'Chest',
};

const makeExercise = (): WorkoutExercise => ({
  exercise,
  targetSets: 3,
  targetReps: 10,
  targetWeight: 85,
  sets: [
    { reps: 10, weight: 85, rir: null, completed: false },
    { reps: 10, weight: 85, rir: null, completed: false },
    { reps: 10, weight: 85, rir: null, completed: false },
  ],
});

const defaultProps = {
  exercises: [] as WorkoutExercise[],
  cardioExercises: [],
  onToggleSet: vi.fn(),
  onLogSet: vi.fn(),
  onRemoveExercise: vi.fn(),
  onRemoveCardioExercise: vi.fn(),
  onClearWorkout: vi.fn(),
  onLogWorkout: vi.fn(),
};

describe('WorkoutTracker', () => {
  it('shows empty state when no exercises are added', () => {
    render(<WorkoutTracker {...defaultProps} />);
    expect(screen.getByText(/no exercises yet/i)).toBeInTheDocument();
  });

  it('renders strength exercises with set bubbles', () => {
    render(<WorkoutTracker {...defaultProps} exercises={[makeExercise()]} />);
    expect(screen.getByText('Chest Press Machine')).toBeInTheDocument();
    expect(screen.getByText((c) => c.includes('Chest') && c.includes('3 × 10'))).toBeInTheDocument();
    expect(screen.getAllByText(/Set \d+/).length).toBe(3);
  });

  it('shows Finish Workout and Clear All buttons when exercises exist', () => {
    render(<WorkoutTracker {...defaultProps} exercises={[makeExercise()]} />);
    const finishBtns = screen.getAllByText('Finish Workout');
    expect(finishBtns.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Clear All')).toBeInTheDocument();
  });

  it('shows the planned item count', () => {
    render(<WorkoutTracker {...defaultProps} exercises={[makeExercise()]} />);
    expect(screen.getByText((c) => c.includes('planned item'))).toBeInTheDocument();
  });
});
