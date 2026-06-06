import { useEffect, useRef, useState } from 'react';
import { useTimer } from '../hooks/useTimer';
import { playBrowserBeep, playRestTimerCue } from '../restTimerAudio';

const PRESETS = [30, 60, 90, 120, 180];

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

type RestTimerProps = {
  autoStartKey?: number;
  initialSeconds?: number;
  modal?: boolean;
  onClose?: () => void;
  onSaveDefault?: (seconds: number) => void;
  playBeep?: (durationSeconds: number) => void;
};

export function RestTimer({
  autoStartKey,
  initialSeconds = 90,
  modal = false,
  onClose,
  onSaveDefault,
  playBeep = playBrowserBeep,
}: RestTimerProps) {
  const { seconds, running, start, pause, reset, preset } = useTimer();
  const beepedSecondsRef = useRef<Set<number>>(new Set());
  const hasStartedRef = useRef(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (autoStartKey === undefined) return;

    beepedSecondsRef.current = new Set();
    hasStartedRef.current = true;
    start(initialSeconds);
  }, [autoStartKey, initialSeconds, start]);

  useEffect(() => {
    if (!hasStartedRef.current || beepedSecondsRef.current.has(seconds)) return;

    playRestTimerCue(seconds, playBeep);
    if (seconds <= 3) {
      beepedSecondsRef.current.add(seconds);
    }
  }, [playBeep, seconds]);

  function handleSaveDefault() {
    onSaveDefault?.(seconds);
    setSaveMessage('Default timer saved');
  }

  const timer = (
    <div className="rest-timer">
      <div className="timer-header-row">
        <h3 className="timer-title">Rest Timer</h3>
        {modal && (
          <button className="remove-btn" onClick={onClose} aria-label="Close rest timer">✕</button>
        )}
      </div>

      <div className="timer-display">
        <span className="timer-digits">{fmt(seconds)}</span>
      </div>

      <div className="timer-presets">
        {PRESETS.map(p => (
          <button
            key={p}
            className="preset-btn"
            onClick={() => {
              beepedSecondsRef.current = new Set();
              hasStartedRef.current = true;
              setSaveMessage('');
              preset(p);
            }}
          >
            {p < 60 ? `${p}s` : `${p / 60}m`}
          </button>
        ))}
      </div>

      {modal && (
        <div className="timer-save-row">
          <button className="timer-save-btn" onClick={handleSaveDefault} disabled={seconds === 0}>
            Save Preset
          </button>
          {saveMessage && <span className="timer-save-status" role="status">{saveMessage}</span>}
        </div>
      )}

      <div className="timer-controls">
        {!running ? (
          <button className="timer-btn start" onClick={() => {
            hasStartedRef.current = true;
            start();
          }} disabled={seconds === 0}>
            Start
          </button>
        ) : (
          <button className="timer-btn pause" onClick={pause}>
            Pause
          </button>
        )}
        <button className="timer-btn reset" onClick={() => {
          beepedSecondsRef.current = new Set();
          hasStartedRef.current = false;
          reset(0);
        }}>
          Reset
        </button>
      </div>
    </div>
  );

  if (!modal) return timer;

  return (
    <div className="timer-modal-backdrop" role="dialog" aria-label="Rest timer" aria-modal="false">
      <div className="timer-modal-card">
        {timer}
      </div>
    </div>
  );
}
