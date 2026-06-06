import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { WeeklyRoutines } from './WeeklyRoutines';
import { createEmptyWeeklyRoutines } from '../routines';

const defaultProps = {
  routines: createEmptyWeeklyRoutines(),
  todayDay: 'Monday' as const,
  onSaveRoutine: vi.fn(),
  onAddRoutineToWorkout: vi.fn(),
  onReplaceWorkoutWithRoutine: vi.fn(),
};

describe('WeeklyRoutines', () => {
  it('shows a Preset Saved confirmation when the user saves a preset', () => {
    render(<WeeklyRoutines {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: /Save Monday Preset/i }));

    expect(screen.getByRole('status')).toHaveTextContent('Preset Saved');
  });
});
