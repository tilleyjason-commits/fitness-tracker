import { describe, expect, it, vi } from 'vitest';
import { playRestTimerCue } from './restTimerAudio';

describe('playRestTimerCue', () => {
  it('plays quarter-second warning beeps for the final three seconds', () => {
    const playBeep = vi.fn();

    playRestTimerCue(3, playBeep);
    playRestTimerCue(2, playBeep);
    playRestTimerCue(1, playBeep);

    expect(playBeep).toHaveBeenNthCalledWith(1, 0.25);
    expect(playBeep).toHaveBeenNthCalledWith(2, 0.25);
    expect(playBeep).toHaveBeenNthCalledWith(3, 0.25);
  });

  it('plays a half-second completion beep when the timer ends', () => {
    const playBeep = vi.fn();

    playRestTimerCue(0, playBeep);

    expect(playBeep).toHaveBeenCalledWith(0.5);
  });

  it('does not beep before the final three seconds', () => {
    const playBeep = vi.fn();

    playRestTimerCue(4, playBeep);
    playRestTimerCue(90, playBeep);

    expect(playBeep).not.toHaveBeenCalled();
  });
});
