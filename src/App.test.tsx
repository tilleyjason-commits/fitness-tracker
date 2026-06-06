import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

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
});
