import { useTimer } from '../hooks/useTimer';

const PRESETS = [30, 60, 90, 120, 180];

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export function RestTimer() {
  const { seconds, running, start, pause, reset, preset } = useTimer();
  const pct = seconds > 0 ? (seconds / Math.max(seconds, 1)) * 100 : 0;
  void pct;

  return (
    <div className="rest-timer">
      <h3 className="timer-title">Rest Timer</h3>

      <div className="timer-display">
        <span className="timer-digits">{fmt(seconds)}</span>
      </div>

      <div className="timer-presets">
        {PRESETS.map(p => (
          <button
            key={p}
            className="preset-btn"
            onClick={() => preset(p)}
          >
            {p < 60 ? `${p}s` : `${p / 60}m`}
          </button>
        ))}
      </div>

      <div className="timer-controls">
        {!running ? (
          <button className="timer-btn start" onClick={start} disabled={seconds === 0}>
            Start
          </button>
        ) : (
          <button className="timer-btn pause" onClick={pause}>
            Pause
          </button>
        )}
        <button className="timer-btn reset" onClick={() => reset(0)}>
          Reset
        </button>
      </div>
    </div>
  );
}
