import { useCallback, useEffect, useRef, useState } from "react";
import { beatHaptic, urgentHaptic } from "./platform";

export type ClickPitch = "low" | "mid" | "high";

interface Options {
  bpm: number;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  pitch?: ClickPitch;
  volume?: number; // 0-100
  onBeat?: (beatIndex: number) => void;
}

const LOOKAHEAD_MS = 25;
const SCHEDULE_HORIZON_S = 0.1;

const PITCH_HZ: Record<ClickPitch, number> = { low: 800, mid: 1000, high: 1200 };

export function useMetronome(opts: Options) {
  const { bpm, soundEnabled, hapticsEnabled, pitch = "mid", volume = 60, onBeat } = opts;

  const [isRunning, setIsRunning] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const nextBeatTimeRef = useRef(0);
  const beatIndexRef = useRef(0);
  const intervalRef = useRef<number | null>(null);
  const bpmRef = useRef(bpm);
  const soundRef = useRef(soundEnabled);
  const hapticsRef = useRef(hapticsEnabled);
  const pitchRef = useRef(pitch);
  const volumeRef = useRef(volume);
  const onBeatRef = useRef(onBeat);
  const accentRemainingRef = useRef(0);
  const scheduledBeatsRef = useRef<{ time: number; index: number; accent: boolean }[]>([]);

  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);
  useEffect(() => {
    soundRef.current = soundEnabled;
  }, [soundEnabled]);
  useEffect(() => {
    hapticsRef.current = hapticsEnabled;
  }, [hapticsEnabled]);
  useEffect(() => {
    pitchRef.current = pitch;
  }, [pitch]);
  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);
  useEffect(() => {
    onBeatRef.current = onBeat;
  }, [onBeat]);

  const ensureCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      audioCtxRef.current = new Ctor();
    }
    if (audioCtxRef.current.state === "suspended") {
      void audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const scheduleClick = useCallback((time: number, accent: boolean) => {
    const ctx = audioCtxRef.current;
    if (!ctx || !soundRef.current) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    const baseHz = PITCH_HZ[pitchRef.current];
    osc.frequency.value = accent ? Math.round(baseHz * 1.4) : baseHz;
    const peak = Math.max(0, Math.min(1, volumeRef.current / 100)) * 0.4;
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(peak, time + 0.001);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.05);
    osc.connect(gain).connect(ctx.destination);
    osc.start(time);
    osc.stop(time + 0.06);
  }, []);

  const tick = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const interval = 60 / bpmRef.current;
    const horizon = ctx.currentTime + SCHEDULE_HORIZON_S;

    while (nextBeatTimeRef.current < horizon) {
      const beatTime = nextBeatTimeRef.current;
      const beatIdx = beatIndexRef.current;
      const accent = accentRemainingRef.current > 0;
      if (accent) accentRemainingRef.current -= 1;

      scheduleClick(beatTime, accent);
      scheduledBeatsRef.current.push({ time: beatTime, index: beatIdx, accent });

      nextBeatTimeRef.current += interval;
      beatIndexRef.current += 1;
    }

    const now = ctx.currentTime;
    const fired: typeof scheduledBeatsRef.current = [];
    scheduledBeatsRef.current = scheduledBeatsRef.current.filter((b) => {
      if (b.time <= now) {
        fired.push(b);
        return false;
      }
      return true;
    });

    if (fired.length > 0) {
      if (hapticsRef.current) {
        void beatHaptic();
      }
      const last = fired[fired.length - 1];
      onBeatRef.current?.(last.index);
    }
  }, [scheduleClick]);

  const start = useCallback(() => {
    const ctx = ensureCtx();
    if (intervalRef.current !== null) return;
    beatIndexRef.current = 0;
    scheduledBeatsRef.current = [];
    nextBeatTimeRef.current = ctx.currentTime + 0.1;
    intervalRef.current = window.setInterval(tick, LOOKAHEAD_MS);
    setIsRunning(true);
  }, [ensureCtx, tick]);

  const stop = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    scheduledBeatsRef.current = [];
    setIsRunning(false);
  }, []);

  const setBpm = useCallback((_next: number) => {
    const ctx = audioCtxRef.current;
    if (!ctx || intervalRef.current === null) return;
    const interval = 60 / bpmRef.current;
    if (nextBeatTimeRef.current > ctx.currentTime + interval) {
      nextBeatTimeRef.current = ctx.currentTime + interval;
    }
  }, []);

  const fireAccent = useCallback((count = 2) => {
    accentRemainingRef.current = count;
    if (hapticsRef.current) {
      void urgentHaptic();
    }
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return { isRunning, start, stop, setBpm, fireAccent };
}
