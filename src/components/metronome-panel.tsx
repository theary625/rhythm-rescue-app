import { useEffect, useState } from "react";
import { Play, Pause, Minus, Plus } from "lucide-react";
import { useMetronome } from "@/hooks/use-metronome";
import { useCode } from "@/lib/code-store";
import { cn } from "@/lib/utils";

export function MetronomePanel() {
  const { state, dispatch } = useCode();
  const { beat } = useMetronome(state.bpm, state.metronomeOn);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    setPulse((p) => p + 1);
  }, [beat]);

  const inRange = state.bpm >= 100 && state.bpm <= 120;

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
      <div className="flex items-baseline justify-between">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            CPR Metronome
          </div>
          <h3 className="mt-0.5 text-lg font-bold">Compression rate</h3>
        </div>
        <div className={cn("text-xs font-semibold", inRange ? "text-success" : "text-warning")}>
          {inRange ? "✓ AHA target" : "Outside 100–120"}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center">
        <div
          key={pulse}
          className={cn(
            "flex h-32 w-32 items-center justify-center rounded-full text-destructive-foreground transition-transform",
            state.metronomeOn ? "animate-beat bg-gradient-emergency" : "bg-muted text-muted-foreground",
          )}
        >
          <div className="text-center">
            <div className="font-mono text-3xl font-bold">{state.bpm}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest opacity-90">bpm</div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={() => dispatch({ type: "bpm", value: state.bpm - 2 })}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background hover:bg-accent"
          aria-label="Slower"
        >
          <Minus className="h-4 w-4" />
        </button>
        <input
          type="range"
          min={80}
          max={140}
          step={1}
          value={state.bpm}
          onChange={(e) => dispatch({ type: "bpm", value: Number(e.target.value) })}
          className="flex-1 accent-[color:var(--destructive)]"
        />
        <button
          onClick={() => dispatch({ type: "bpm", value: state.bpm + 2 })}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background hover:bg-accent"
          aria-label="Faster"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <button
        onClick={() => dispatch({ type: "toggleMetronome" })}
        className={cn(
          "mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all",
          state.metronomeOn
            ? "bg-foreground text-background hover:opacity-90"
            : "bg-destructive text-destructive-foreground hover:opacity-90 shadow-card",
        )}
      >
        {state.metronomeOn ? (
          <>
            <Pause className="h-4 w-4" /> Pause
          </>
        ) : (
          <>
            <Play className="h-4 w-4" /> Start metronome
          </>
        )}
      </button>

      <div className="mt-4 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        <button onClick={() => dispatch({ type: "bpm", value: 100 })} className="hover:text-foreground">
          100
        </button>
        <button onClick={() => dispatch({ type: "bpm", value: 110 })} className="hover:text-foreground">
          110 (sweet spot)
        </button>
        <button onClick={() => dispatch({ type: "bpm", value: 120 })} className="hover:text-foreground">
          120
        </button>
      </div>
    </div>
  );
}
