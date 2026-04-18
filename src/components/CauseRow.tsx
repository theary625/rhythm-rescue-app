import { cn } from "@/lib/utils";
import type { ReversibleCause } from "@/lib/ahaConstants";

interface Props {
  cause: ReversibleCause;
  checked: boolean;
  onToggle: () => void;
}

export function CauseRow({ cause, checked, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      role="checkbox"
      aria-checked={checked}
      className={cn(
        "flex w-full min-h-12 items-start gap-3 rounded-2xl bg-brand-accent/15 p-4 text-left transition-opacity",
        checked && "opacity-60",
      )}
    >
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-brand-white",
          cause.code === "H" ? "bg-brand-accent" : "bg-brand-red",
        )}
      >
        {cause.code}
      </span>
      <span className="flex-1">
        <span
          className={cn(
            "block text-base font-bold text-brand-white",
            checked && "line-through",
          )}
        >
          {cause.label}
        </span>
        <span className="mt-0.5 block text-xs text-brand-white/70">{cause.prompt}</span>
      </span>
      <span
        className={cn(
          "mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2",
          checked ? "border-brand-red bg-brand-red" : "border-white/40",
        )}
        aria-hidden="true"
      >
        {checked && (
          <svg viewBox="0 0 16 16" className="h-4 w-4 text-white" fill="none">
            <path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
    </button>
  );
}
