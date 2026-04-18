interface Row {
  name: string;
  doseDisplay: string;
  offsetSec: number;
}

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function DrugLogList({ rows }: { rows: Row[] }) {
  if (rows.length === 0) {
    return (
      <p className="text-sm italic text-brand-navy/60">No drugs logged.</p>
    );
  }
  return (
    <ul className="divide-y divide-brand-navy/10">
      {rows.map((r, i) => (
        <li
          key={i}
          className="flex items-center gap-3 py-2 text-sm"
        >
          <span className="font-mono tabular-nums text-brand-navy/70">{fmt(r.offsetSec)}</span>
          <span className="font-semibold text-brand-navy">{r.name}</span>
          <span className="text-brand-navy/70">·</span>
          <span className="text-brand-navy/80">{r.doseDisplay}</span>
        </li>
      ))}
    </ul>
  );
}
