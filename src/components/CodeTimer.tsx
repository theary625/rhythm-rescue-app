import { useEffect, useState } from "react";

export function formatElapsed(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60).toString().padStart(2, "0");
  const s = (total % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

interface Props {
  startedAt: number | null;
  className?: string;
  onTick?: (elapsedMs: number) => void;
}

export function CodeTimer({ startedAt, className, onTick }: Props) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!startedAt) return;
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, [startedAt]);

  const elapsed = startedAt ? now - startedAt : 0;

  useEffect(() => {
    if (startedAt) onTick?.(elapsed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Math.floor(elapsed / 1000)]);

  return (
    <div className={className}>
      <span className="font-mono font-semibold tabular-nums">{formatElapsed(elapsed)}</span>
    </div>
  );
}
