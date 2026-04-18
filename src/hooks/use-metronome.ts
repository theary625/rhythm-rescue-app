import { useEffect, useRef, useState } from "react";

/**
 * Web Audio metronome. Schedules clicks ahead of time on an AudioContext
 * timeline for rock-solid timing — does NOT use setInterval for the click.
 */
export function useMetronome(bpm: number, running: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);
  const nextNoteRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const [beat, setBeat] = useState(0);
  const beatRef = useRef(0);

  useEffect(() => {
    if (!running) {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }

    if (!ctxRef.current) {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctxRef.current = new Ctor();
    }
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") void ctx.resume();

    const interval = 60 / bpm;
    nextNoteRef.current = ctx.currentTime + 0.05;

    const scheduler = () => {
      while (nextNoteRef.current < ctx.currentTime + 0.1) {
        const t = nextNoteRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const accent = beatRef.current % 4 === 0;
        osc.frequency.value = accent ? 1400 : 1000;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(accent ? 0.45 : 0.3, t + 0.001);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
        osc.connect(gain).connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.06);

        const visualDelay = Math.max(0, (t - ctx.currentTime) * 1000);
        const b = beatRef.current;
        window.setTimeout(() => setBeat(b), visualDelay);

        beatRef.current += 1;
        nextNoteRef.current += interval;
      }
    };

    timerRef.current = window.setInterval(scheduler, 25);
    scheduler();

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [bpm, running]);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      ctxRef.current?.close().catch(() => {});
    };
  }, []);

  return { beat };
}
