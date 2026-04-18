import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  bpm: number;
  running: boolean;
  beatTick: number;
}

export function PulseCircle({ bpm, running, beatTick }: Props) {
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
          "flex aspect-square w-[60vw] max-w-[420px] items-center justify-center rounded-full border-[6px]",
          "transition-transform duration-150 ease-out",
          running ? "border-brand-red" : "border-white/20",
          pulsing && "scale-[1.12]",
        )}
        style={{ transform: pulsing ? "scale(1.12)" : "scale(1)" }}
      >
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
