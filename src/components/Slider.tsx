interface Props {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (n: number) => void;
}

export function Slider({ label, value, min, max, step = 1, onChange }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="text-base font-semibold text-brand-navy">{label}</div>
        <div className="font-mono text-sm tabular-nums text-brand-navy/70">{value}</div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        aria-label={label}
        className="mt-2 h-12 w-full accent-brand-red"
      />
    </div>
  );
}
