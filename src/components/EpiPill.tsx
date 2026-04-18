import { cn } from "@/lib/utils";
import type { EpiTimer } from "@/lib/useEpiTimer";

function fmt(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = (total % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function EpiPill({ timer }: { timer: EpiTimer }) {
  if (timer.state === "idle") return null;

  let label: string;
  let cls: string;
  if (timer.state === "countdown") {
    label = `Epi due in ${fmt(timer.remainingMs)}`;
    cls = "bg-brand-accent/40 text-brand-white";
  } else if (timer.state === "window") {
    label = "Epi window open";
    cls = "bg-brand-softblue text-brand-navy";
  } else {
    label = `Epi due now · +${fmt(timer.overdueMs)}`;
    cls = "bg-brand-red text-brand-white";
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold tabular-nums",
        cls,
      )}
    >
      {label}
    </div>
  );
}
