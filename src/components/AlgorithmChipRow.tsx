import { cn } from "@/lib/utils";
import { CHIP_ALGORITHMS, type AlgorithmId } from "@/lib/algorithms";

export function AlgorithmChipRow({
  value,
  onChange,
}: {
  value: AlgorithmId;
  onChange: (id: AlgorithmId) => void;
}) {
  return (
    <div className="-mx-1 flex gap-1 overflow-x-auto pb-1">
      {CHIP_ALGORITHMS.map((c) => {
        const selected = value === c.id;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onChange(c.id)}
            className={cn(
              "min-h-10 shrink-0 rounded-full px-3 text-xs font-semibold transition-colors",
              selected
                ? "bg-brand-white text-brand-navy"
                : "bg-brand-accent/30 text-brand-white/80 hover:bg-brand-accent/50",
            )}
          >
            {c.label}
          </button>
        );
      })}
    </div>
  );
}
