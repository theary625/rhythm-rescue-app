interface Props {
  value: number | null;
  onChange: (v: number | null) => void;
}

export function WeightInput({ value, onChange }: Props) {
  return (
    <div className="rounded-2xl bg-brand-accent/15 p-4">
      <div className="text-sm font-bold tracking-tight text-brand-white">Patient weight</div>
      <p className="mt-1 text-xs text-brand-white/70">
        Enter the patient's weight to display calculated doses below.
      </p>
      <div className="mt-3 flex items-center gap-2">
        <input
          type="number"
          inputMode="decimal"
          min={0.1}
          max={200}
          step={0.1}
          value={value ?? ""}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === "") return onChange(null);
            const n = parseFloat(raw);
            if (Number.isNaN(n)) return onChange(null);
            const clamped = Math.min(200, Math.max(0.1, n));
            onChange(clamped);
          }}
          placeholder="0.0"
          aria-label="Patient weight in kilograms"
          className="h-12 w-full rounded-xl border border-white/20 bg-brand-navy px-3 font-mono text-lg tabular-nums text-brand-white outline-none focus:border-brand-red"
        />
        <span className="text-base font-bold text-brand-white">kg</span>
      </div>
      <p className="mt-2 text-[11px] text-brand-white/60">
        Verify weight with the team. Cognitive aid only.
      </p>
    </div>
  );
}
