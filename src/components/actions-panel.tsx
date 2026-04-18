import { useCode, fmt, type EventKind } from "@/lib/code-store";
import { Zap, Syringe, Activity, Heart, FileText, Play, StopCircle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS: Record<EventKind, React.ComponentType<{ className?: string }>> = {
  start: Play,
  stop: StopCircle,
  shock: Zap,
  epi: Syringe,
  amio: Syringe,
  atropine: Syringe,
  rhythm: Activity,
  rosc: Heart,
  note: FileText,
};

const COLORS: Record<EventKind, string> = {
  start: "bg-primary/10 text-primary",
  stop: "bg-muted text-muted-foreground",
  shock: "bg-shock/15 text-shock-foreground",
  epi: "bg-meds/15 text-meds",
  amio: "bg-meds/15 text-meds",
  atropine: "bg-meds/15 text-meds",
  rhythm: "bg-primary/10 text-primary",
  rosc: "bg-success/15 text-success",
  note: "bg-muted text-muted-foreground",
};

export function ActionsPanel() {
  const { state, dispatch } = useCode();
  const started = !!state.startedAt;

  const log = (kind: EventKind, label: string) => dispatch({ type: "log", kind, label });

  const Btn = ({
    onClick,
    label,
    icon: Icon,
    variant = "default",
    disabled,
  }: {
    onClick: () => void;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    variant?: "default" | "shock" | "med" | "rosc";
    disabled?: boolean;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group relative flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-bold uppercase tracking-wide transition-all disabled:cursor-not-allowed disabled:opacity-40",
        variant === "shock" &&
          "border-shock/40 bg-shock/10 text-shock-foreground hover:bg-shock/20 hover:shadow-card",
        variant === "med" &&
          "border-meds/30 bg-meds/5 text-meds hover:bg-meds/15 hover:shadow-card",
        variant === "rosc" &&
          "border-success/40 bg-success/10 text-success hover:bg-success/20 hover:shadow-card",
        variant === "default" && "border-border bg-background hover:bg-accent",
      )}
    >
      <Icon className="h-5 w-5" />
      {label}
    </button>
  );

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Code Console
          </div>
          <h3 className="mt-0.5 text-lg font-bold">Quick actions</h3>
        </div>
        <div className="flex gap-2">
          {!started ? (
            <button
              onClick={() => dispatch({ type: "start" })}
              className="inline-flex items-center gap-1.5 rounded-lg bg-destructive px-4 py-2 text-sm font-bold text-destructive-foreground shadow-card hover:opacity-90"
            >
              <Play className="h-4 w-4" /> Start Code
            </button>
          ) : (
            <button
              onClick={() => {
                dispatch({ type: "log", kind: "stop", label: "Code ended" });
                dispatch({ type: "stop" });
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold hover:bg-accent"
            >
              <StopCircle className="h-4 w-4" /> End
            </button>
          )}
          {state.events.length > 0 && (
            <button
              onClick={() => {
                if (confirm("Reset code timer & event log?")) dispatch({ type: "reset" });
              }}
              className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold hover:bg-accent"
              aria-label="Reset"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
        <Btn onClick={() => log("shock", "Shock delivered")} label="Shock" icon={Zap} variant="shock" disabled={!started} />
        <Btn onClick={() => log("epi", "Epinephrine 1 mg")} label="Epi 1 mg" icon={Syringe} variant="med" disabled={!started} />
        <Btn onClick={() => log("amio", "Amiodarone 300 mg")} label="Amio" icon={Syringe} variant="med" disabled={!started} />
        <Btn onClick={() => log("atropine", "Atropine 1 mg")} label="Atropine" icon={Syringe} variant="med" disabled={!started} />
        <Btn onClick={() => log("rhythm", "Rhythm check")} label="Rhythm" icon={Activity} disabled={!started} />
        <Btn onClick={() => log("rosc", "ROSC")} label="ROSC" icon={Heart} variant="rosc" disabled={!started} />
        <Btn
          onClick={() => {
            const note = prompt("Note:");
            if (note) log("note", note);
          }}
          label="Note"
          icon={FileText}
          disabled={!started}
        />
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          <span>Event log</span>
          <span>{state.events.length} events</span>
        </div>
        <div className="max-h-72 overflow-y-auto rounded-lg border border-border bg-background">
          {state.events.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No events yet. Press <span className="font-semibold text-foreground">Start Code</span> to begin.
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {[...state.events].reverse().map((e) => {
                const Icon = ICONS[e.kind];
                return (
                  <li key={e.id} className="flex items-center gap-3 px-3 py-2.5">
                    <span className={cn("flex h-7 w-7 items-center justify-center rounded-md", COLORS[e.kind])}>
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="flex-1 text-sm font-medium">{e.label || "—"}</span>
                    <span className="font-mono text-xs tabular-nums text-muted-foreground">
                      {fmt(e.elapsed)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
