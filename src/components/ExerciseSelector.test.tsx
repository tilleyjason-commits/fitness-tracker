import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExerciseSelector } from './ExerciseSelector';

const defaultProps = {
  onAdd: vi.fn(),
  onAddCardio: vi.fn(),
};

describe('ExerciseSelector', () => {
  it('renders the default title', () => {
    render(<ExerciseSelector {...defaultProps} />);
    expect(screen.getByText('Add Exercise')).toBeInTheDocument();
  });

  it('renders muscle group tabs', () => {
    render(<ExerciseSelector {...defaultProps} />);
    expect(screen.getByText('Chest')).toBeInTheDocument();
    expect(screen.getByText('Cardio')).toBeInTheDocument();
  });

  it('shows exercise list items for the default group', () => {
    render(<ExerciseSelector {...defaultProps} />);
    // Chest exercises should be visible by default
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('switches to cardio tab and shows cardio equipment', () => {
    render(<ExerciseSelector {...defaultProps} />);
    fireEvent.click(screen.getByText('Cardio'));
    expect(screen.getByText('Treadmill')).toBeInTheDocument();
  });

  it('lets the user manually enter an exact weight while plus and minus adjust by five', () => {
    const onAdd = vi.fn();
    render(<ExerciseSelector {...defaultProps} onAdd={onAdd} />);

    fireEvent.click(screen.getByText('Chest Press Machine'));
    const weightInput = screen.getByLabelText('Weight');

    fireEvent.change(weightInput, { target: { value: '3' } });
    expect(weightInput).toHaveValue(3);

    fireEvent.click(screen.getByRole('button', { name: /increase weight/i }));
    expect(weightInput).toHaveValue(8);

    fireEvent.click(screen.getByRole('button', { name: /decrease weight/i }));
    expect(weightInput).toHaveValue(3);

    fireEvent.click(screen.getByRole('button', { name: /Add to Workout/i }));
    expect(onAdd).toHaveBeenCalledWith(expect.any(Object), 3, 10, 3);
  });
});
