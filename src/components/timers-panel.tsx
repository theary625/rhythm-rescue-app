import { useEffect, useState } from "react";
import { useCode, lastEventOfKind, fmt } from "@/lib/code-store";
import { Timer, Syringe, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const CYCLE_MS = 2 * 60 * 1000;
const EPI_MIN_MS = 3 * 60 * 1000;
const EPI_MAX_MS = 5 * 60 * 1000;

export function TimersPanel() {
  const { state } = useCode();
  const [, setTick] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 250);
    return () => clearInterval(i);
  }, []);

  const now = Date.now();
  const elapsed = state.startedAt ? now - state.startedAt : 0;

  const lastRhythm = lastEventOfKind(state.events, "rhythm") ?? lastEventOfKind(state.events, "start");
  const sinceCycle = lastRhythm ? now - lastRhythm.at : 0;
  const cycleRemain = Math.max(0, CYCLE_MS - sinceCycle);
  const cyclePct = Math.min(100, (sinceCycle / CYCLE_MS) * 100);
  const cycleAlert = cycleRemain === 0 && state.startedAt;

  const lastEpi = lastEventOfKind(state.events, "epi");
  const sinceEpi = lastEpi ? now - lastEpi.at : null;
  const epiAlert = sinceEpi !== null && sinceEpi >= EPI_MIN_MS;
  const epiOverdue = sinceEpi !== null && sinceEpi >= EPI_MAX_MS;

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div
        className={cn(
          "rounded-2xl border bg-surface p-4 shadow-card",
          cycleAlert ? "border-destructive bg-destructive/5" : "border-border",
        )}
      >
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Timer className="h-3.5 w-3.5" /> Code Time
          </span>
        </div>
        <div className="mt-2 font-mono text-3xl font-bold tabular-nums">
          {fmt(elapsed)}
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          {state.startedAt ? "Running" : "Press Start Code"}
        </div>
      </div>

      <div
        className={cn(
          "rounded-2xl border bg-surface p-4 shadow-card",
          cycleAlert ? "border-destructive bg-destructive/5 animate-pulse" : "border-border",
        )}
      >
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
          <span>2-Min CPR Cycle</span>
          {cycleAlert && <AlertCircle className="h-4 w-4 text-destructive" />}
        </div>
        <div
          className={cn(
            "mt-2 font-mono text-3xl font-bold tabular-nums",
            cycleAlert ? "text-destructive" : "",
          )}
        >
          {state.startedAt ? fmt(cycleRemain) : "02:00"}
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className={cn("h-full transition-all", cycleAlert ? "bg-destructive" : "bg-primary")}
            style={{ width: `${cyclePct}%` }}
          />
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          {cycleAlert ? "Rhythm check NOW" : "Until next rhythm check"}
        </div>
      </div>

      <div
        className={cn(
          "rounded-2xl border bg-surface p-4 shadow-card",
          epiOverdue ? "border-destructive bg-destructive/5" : epiAlert ? "border-warning bg-warning/10" : "border-border",
        )}
      >
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Syringe className="h-3.5 w-3.5" /> Epi Timer
          </span>
        </div>
        <div
          className={cn(
            "mt-2 font-mono text-3xl font-bold tabular-nums",
            epiOverdue ? "text-destructive" : epiAlert ? "text-warning" : "",
          )}
        >
          {sinceEpi === null ? "—:—" : fmt(sinceEpi)}
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          {sinceEpi === null
            ? "No dose given"
            : epiOverdue
              ? "Overdue · give now"
              : epiAlert
                ? "Window open (3–5 min)"
                : "Wait for window"}
        </div>
      </div>
    </div>
  );
}
