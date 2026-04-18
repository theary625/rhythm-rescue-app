export function TriageDecision({
  prompt,
  leftLabel,
  rightLabel,
  onSelect,
}: {
  prompt: string;
  leftLabel: string;
  rightLabel: string;
  onSelect: (choice: "left" | "right") => void;
}) {
  return (
    <div className="rounded-2xl bg-brand-accent/15 p-4">
      <div className="text-sm font-bold tracking-tight text-brand-white">{prompt}</div>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onSelect("left")}
          className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-brand-red px-4 text-sm font-bold text-brand-white hover:brightness-110"
        >
          {leftLabel}
        </button>
        <button
          type="button"
          onClick={() => onSelect("right")}
          className="inline-flex min-h-14 items-center justify-center rounded-2xl border-2 border-brand-accent px-4 text-sm font-bold text-brand-white hover:bg-brand-accent/20"
        >
          {rightLabel}
        </button>
      </div>
    </div>
  );
}
