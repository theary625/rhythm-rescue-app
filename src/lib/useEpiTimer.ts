import { useEffect, useRef, useState } from "react";
import { useApp } from "./app-context";
import { EPI_CYCLE_MIN_MS, EPI_CYCLE_MAX_MS } from "./ahaConstants";
import { speak, VOICE_LINES } from "./voice";
import { urgentHaptic } from "./platform";

export type EpiState = "idle" | "countdown" | "window" | "due";

export interface EpiTimer {
  state: EpiState;
  /** ms since last dose, 0 if idle */
  elapsedMs: number;
  /** ms remaining until window opens (state=countdown) or until due (state=window). 0 in idle/due. */
  remainingMs: number;
  /** ms past the 5:00 threshold when state=due, else 0 */
  overdueMs: number;
}

export function useEpiTimer(): EpiTimer {
  const { code, haptics } = useApp();
  const [now, setNow] = useState(() => Date.now());
  const lastStateRef = useRef<EpiState>("idle");

  useEffect(() => {
    if (!code.epiLastDoseAt) {
      lastStateRef.current = "idle";
      return;
    }
    const id = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(id);
  }, [code.epiLastDoseAt]);

  if (!code.epiLastDoseAt) {
    return { state: "idle", elapsedMs: 0, remainingMs: 0, overdueMs: 0 };
  }

  const elapsed = now - code.epiLastDoseAt;
  let state: EpiState;
  let remainingMs = 0;
  let overdueMs = 0;

  if (elapsed < EPI_CYCLE_MIN_MS) {
    state = "countdown";
    remainingMs = EPI_CYCLE_MIN_MS - elapsed;
  } else if (elapsed < EPI_CYCLE_MAX_MS) {
    state = "window";
    remainingMs = EPI_CYCLE_MAX_MS - elapsed;
  } else {
    state = "due";
    overdueMs = elapsed - EPI_CYCLE_MAX_MS;
  }

  // Single short haptic + voice cue on transitions
  if (state !== lastStateRef.current) {
    if ((state === "window" || state === "due") && haptics) {
      void urgentHaptic();
    }
    if (state === "window") speak(VOICE_LINES.epiWindow);
    if (state === "due") speak(VOICE_LINES.epiDue, { priority: "urgent" });
    lastStateRef.current = state;
  }

  return { state, elapsedMs: elapsed, remainingMs, overdueMs };
}
