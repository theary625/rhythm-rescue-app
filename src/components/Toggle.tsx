import { cn } from "@/lib/utils";

interface Props {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (b: boolean) => void;
  disabled?: boolean;
}

export function Toggle({ label, description, checked, onChange, disabled = false }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex w-full min-h-12 items-center justify-between gap-4 py-2 text-left",
        disabled && "opacity-50 cursor-not-allowed",
      )}
    >
      <div className="flex-1">
        <div className="text-base font-semibold text-brand-navy">{label}</div>
        {description && (
          <div className="mt-0.5 text-sm text-brand-navy/60">{description}</div>
        )}
      </div>
      <span
        className={cn(
          "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors",
          checked ? "bg-brand-red" : "bg-brand-navy/20",
        )}
      >
        <span
          className={cn(
            "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-6" : "translate-x-1",
          )}
        />
      </span>
    </button>
  );
}
