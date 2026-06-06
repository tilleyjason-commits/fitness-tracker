import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { RestTimer } from './RestTimer';

describe('RestTimer', () => {
  it('lets the user save the currently selected popup timer as the default preset', () => {
    const onSaveDefault = vi.fn();

    render(<RestTimer modal initialSeconds={90} onSaveDefault={onSaveDefault} />);

    fireEvent.click(screen.getByRole('button', { name: '2m' }));
    fireEvent.click(screen.getByRole('button', { name: /Save Preset/i }));

    expect(onSaveDefault).toHaveBeenCalledWith(120);
    expect(screen.getByRole('status')).toHaveTextContent(/default timer saved/i);
  });
});
