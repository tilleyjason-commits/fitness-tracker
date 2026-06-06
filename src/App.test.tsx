import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

const today = new Date().toISOString().slice(0, 10);

function seedWorkout(setCount = 1) {
  localStorage.setItem(`fitness-tracker-workout:${account.id}`, JSON.stringify({
    date: today,
    cardioExercises: [],
    exercises: [{
      exercise: { id: 'chest-press', name: 'Chest Press Machine', muscleGroup: 'Chest' },
      targetSets: setCount,
      targetReps: 10,
      targetWeight: 85,
      sets: Array.from({ length: setCount }, () => ({ reps: 10, weight: 85, rir: null, completed: false })),
    }],
  }));
}

const account = {
  id: 'test-user',
  name: 'Test User',
  username: 'test-user',
  passwordHash: 'password-hash',
  createdAt: '2026-06-06T00:00:00.000Z',
};

describe('App page navigation', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('fitness-tracker-accounts', JSON.stringify([account]));
    localStorage.setItem('fitness-tracker-session', JSON.stringify({ userId: account.id }));
  });

  it('keeps preset setup off the main workout page until the user opens it', () => {
    render(<App />);

    expect(screen.getByText('Add Exercise')).toBeInTheDocument();
    expect(screen.getByText(/No exercises yet/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Setup Presets/i })).toBeInTheDocument();
    expect(screen.queryByText('Weekly Routines')).not.toBeInTheDocument();
  });

  it('lets the user open preset setup and return to the workout page', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Setup Presets/i }));

    expect(screen.getByText('Weekly Routines')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Back to Workout/i })).toBeInTheDocument();
    expect(screen.queryByText('Add Exercise')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Back to Workout/i }));

    expect(screen.getByText('Add Exercise')).toBeInTheDocument();
    expect(screen.queryByText('Weekly Routines')).not.toBeInTheDocument();
  });

  it('places Add Exercise above workout history on the main page', () => {
    render(<App />);

    const addExercise = screen.getByRole('heading', { name: /Add Exercise/i });
    const workoutHistory = screen.getByRole('heading', { name: /Workout History/i });

    expect(addExercise.compareDocumentPosition(workoutHistory) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('opens an automatic rest timer window after logging a set', () => {
    seedWorkout();

    render(<App />);

    expect(screen.queryByRole('heading', { name: /Rest Timer/i })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Set 1 incomplete/i }));
    fireEvent.click(screen.getByRole('button', { name: /Log Set/i }));

    expect(screen.getByRole('dialog', { name: /Rest timer/i })).toBeInTheDocument();
    expect(screen.getByText('1:30')).toBeInTheDocument();
  });

  it('uses the saved timer preset for future rest timer popups', () => {
    seedWorkout(2);

    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Set 1 incomplete/i }));
    fireEvent.click(screen.getByRole('button', { name: /Log Set/i }));
    fireEvent.click(screen.getByRole('button', { name: '2m' }));
    fireEvent.click(screen.getByRole('button', { name: /Save Preset/i }));
    fireEvent.click(screen.getByRole('button', { name: /Close rest timer/i }));

    fireEvent.click(screen.getByRole('button', { name: /Set 2 incomplete/i }));
    fireEvent.click(screen.getByRole('button', { name: /Log Set/i }));

    expect(screen.getByRole('dialog', { name: /Rest timer/i })).toBeInTheDocument();
    expect(screen.getByText('2:00')).toBeInTheDocument();
  });
});
