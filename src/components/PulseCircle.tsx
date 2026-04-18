import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  bpm: number;
  running: boolean;
  beatTick: number;
  colorBlind?: boolean;
}

export function PulseCircle({ bpm, running, beatTick, colorBlind = false }: Props) {
  const [pulsing, setPulsing] = useState(false);

  useEffect(() => {
    if (!running) return;
    setPulsing(true);
    const t = window.setTimeout(() => setPulsing(false), 120);
    return () => window.clearTimeout(t);
  }, [beatTick, running]);

  return (
    <div className="flex items-center justify-center">
      <div
        className={cn(
          "relative flex aspect-square w-[60vw] max-w-[420px] items-center justify-center rounded-full border-[6px]",
          "transition-transform duration-150 ease-out",
          running ? "border-brand-red" : "border-white/20",
          colorBlind && running && "border-dotted",
          pulsing && "scale-[1.12]",
        )}
        style={{ transform: pulsing ? "scale(1.12)" : "scale(1)" }}
      >
        {colorBlind && running && (
          <span
            aria-hidden
            className={cn(
              "absolute -top-2 left-1/2 inline-block h-4 w-4 -translate-x-1/2 rounded-full bg-brand-white transition-opacity duration-150",
              pulsing ? "opacity-100" : "opacity-30",
            )}
          />
        )}
        <div className="flex flex-col items-center">
          <div className="font-mono font-semibold tabular-nums text-7xl leading-none text-brand-white sm:text-8xl">
            {bpm}
          </div>
          <div className="mt-2 text-xs font-bold uppercase tracking-widest text-brand-white/60">
            BPM
          </div>
        </div>
      </div>
    </div>
  );
}
