type BeepPlayer = (durationSeconds: number) => void;

type WindowWithAudio = Window & typeof globalThis & {
  webkitAudioContext?: typeof AudioContext;
};

export function playBrowserBeep(durationSeconds: number) {
  const AudioContextCtor = window.AudioContext ?? (window as WindowWithAudio).webkitAudioContext;
  if (!AudioContextCtor) return;

  const audioContext = new AudioContextCtor();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.value = 880;
  gain.gain.value = 0.08;

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + durationSeconds);
}

export function playRestTimerCue(secondsRemaining: number, playBeep: BeepPlayer = playBrowserBeep) {
  if (secondsRemaining >= 1 && secondsRemaining <= 3) {
    playBeep(0.25);
    return;
  }

  if (secondsRemaining === 0) {
    playBeep(0.5);
  }
}
