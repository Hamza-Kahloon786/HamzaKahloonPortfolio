"use client";

/**
 * Tiny UI sound kit synthesized with the Web Audio API (no audio files).
 * Off by default; the visitor's choice is remembered in localStorage.
 */
export type Sound = "tick" | "click" | "open" | "close" | "on" | "start" | "end";

const KEY = "hk-sound";
let ctx: AudioContext | null = null;
let enabled: boolean | null = null;
const listeners = new Set<() => void>();

function read() {
  if (enabled === null) {
    try {
      enabled = localStorage.getItem(KEY) === "1";
    } catch {
      enabled = false;
    }
  }
  return enabled;
}

export const soundStore = {
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  get: () => read(),
  server: () => false,
};

export function setSoundEnabled(on: boolean) {
  enabled = on;
  try {
    localStorage.setItem(KEY, on ? "1" : "0");
  } catch {}
  listeners.forEach((l) => l());
  if (on) play("on");
}

function audio() {
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** One enveloped oscillator note. */
function note(ac: AudioContext, freq: number, start: number, dur: number, gain: number, type: OscillatorType = "sine", toFreq?: number) {
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (toFreq) osc.frequency.exponentialRampToValueAtTime(toFreq, start + dur);
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(gain, start + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  osc.connect(g).connect(ac.destination);
  osc.start(start);
  osc.stop(start + dur + 0.02);
}

export function play(sound: Sound) {
  if (!read()) return;
  const ac = audio();
  if (!ac) return;
  const t = ac.currentTime + 0.005;
  switch (sound) {
    case "tick":
      note(ac, 2100, t, 0.035, 0.012);
      break;
    case "click":
      note(ac, 640, t, 0.08, 0.05, "triangle", 420);
      break;
    case "open":
      note(ac, 440, t, 0.22, 0.035, "sine", 880);
      note(ac, 660, t + 0.05, 0.2, 0.02, "sine", 1320);
      break;
    case "close":
      note(ac, 820, t, 0.2, 0.03, "sine", 410);
      break;
    case "on":
      note(ac, 660, t, 0.14, 0.04);
      note(ac, 990, t + 0.09, 0.2, 0.04);
      break;
    case "start":
      [523.25, 659.25, 783.99].forEach((f, i) => note(ac, f, t + i * 0.08, 0.22, 0.045));
      break;
    case "end":
      [783.99, 659.25, 523.25].forEach((f, i) => note(ac, f, t + i * 0.08, 0.22, 0.04));
      break;
  }
}
