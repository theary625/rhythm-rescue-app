import { cn } from "@/lib/utils";

interface Option<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
  label?: string;
  className?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: Props<T>) {
  return (
    <div className={className}>
      {label && (
        <div className="mb-2 text-sm font-semibold text-brand-white/70 uppercase tracking-wider">
          {label}
        </div>
      )}
      <div
        role="radiogroup"
        aria-label={label}
        className="flex w-full gap-1 rounded-2xl bg-brand-accent/40 p-1"
      >
        {options.map((opt) => {
          const selected = opt.value === value;
          return (
            <button
              key={opt.value}
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(opt.value)}
              className={cn(
                "flex-1 min-h-12 rounded-xl px-4 text-sm font-semibold transition-all duration-150",
                selected
                  ? "bg-brand-white text-brand-navy shadow-sm"
                  : "text-brand-white/80 hover:text-brand-white",
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
