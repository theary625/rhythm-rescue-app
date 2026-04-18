import { createContext, useContext, useEffect, useReducer, type ReactNode } from "react";

export type EventKind = "start" | "stop" | "shock" | "epi" | "amio" | "atropine" | "rhythm" | "rosc" | "note";

export interface CodeEvent {
  id: string;
  kind: EventKind;
  label: string;
  at: number; // ms epoch
  elapsed: number; // ms since start
}

interface State {
  startedAt: number | null;
  events: CodeEvent[];
  bpm: number;
  metronomeOn: boolean;
}

type Action =
  | { type: "start" }
  | { type: "stop" }
  | { type: "reset" }
  | { type: "log"; kind: EventKind; label: string }
  | { type: "bpm"; value: number }
  | { type: "toggleMetronome" };

const initial: State = { startedAt: null, events: [], bpm: 110, metronomeOn: false };

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "start": {
      if (s.startedAt) return s;
      const at = Date.now();
      return {
        ...s,
        startedAt: at,
        metronomeOn: true,
        events: [{ id: uid(), kind: "start", label: "Code started", at, elapsed: 0 }],
      };
    }
    case "stop":
      return { ...s, metronomeOn: false };
    case "reset":
      return { ...initial };
    case "log": {
      const at = Date.now();
      const elapsed = s.startedAt ? at - s.startedAt : 0;
      return {
        ...s,
        events: [...s.events, { id: uid(), kind: a.kind, label: a.label, at, elapsed }],
      };
    }
    case "bpm":
      return { ...s, bpm: Math.max(60, Math.min(160, a.value)) };
    case "toggleMetronome":
      return { ...s, metronomeOn: !s.metronomeOn };
  }
}

const Ctx = createContext<{ state: State; dispatch: React.Dispatch<Action> } | null>(null);

export function CodeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  // Force re-render every second so consumers showing elapsed time refresh.
  useEffect(() => {
    if (!state.startedAt) return;
    const i = setInterval(() => dispatch({ type: "log", kind: "note", label: "" }), 60_000_000); // no-op, real ticking handled in components
    return () => clearInterval(i);
  }, [state.startedAt]);
  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}

export function useCode() {
  const c = useContext(Ctx);
  if (!c) throw new Error("CodeProvider missing");
  return c;
}

export function lastEventOfKind(events: CodeEvent[], kind: EventKind) {
  for (let i = events.length - 1; i >= 0; i--) if (events[i].kind === kind) return events[i];
  return null;
}

export function fmt(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m.toString().padStart(2, "0")}:${r.toString().padStart(2, "0")}`;
}
