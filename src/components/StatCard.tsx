interface Props {
  label: string;
  value: string;
}

export function StatCard({ label, value }: Props) {
  return (
    <div className="flex flex-col rounded-2xl bg-brand-accent/20 p-4 text-brand-white">
      <div className="text-[10px] font-bold uppercase tracking-widest text-brand-white/60">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold leading-snug">{value}</div>
    </div>
  );
}
