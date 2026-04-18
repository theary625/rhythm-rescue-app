interface Props {
  label: string;
  value: string;
  subLabel?: string;
}

export function DebriefStatCard({ label, value, subLabel }: Props) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="text-[11px] font-bold uppercase tracking-widest text-brand-navy/60">
        {label}
      </div>
      <div className="mt-2 font-mono font-semibold tabular-nums text-3xl leading-none text-brand-navy">
        {value}
      </div>
      {subLabel && (
        <div className="mt-1 text-xs text-brand-navy/60">{subLabel}</div>
      )}
    </div>
  );
}
