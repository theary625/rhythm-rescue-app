import { useEffect, useState } from "react";
import { Button } from "./Button";
import { PULSE_CHECK_SECONDS } from "@/lib/ahaConstants";

interface Props {
  open: boolean;
  onResume: () => void;
  onComplete: () => void;
}

export function PulseCheckOverlay({ open, onResume, onComplete }: Props) {
  const [remaining, setRemaining] = useState(PULSE_CHECK_SECONDS);

  useEffect(() => {
    if (!open) {
      setRemaining(PULSE_CHECK_SECONDS);
      return;
    }
    setRemaining(PULSE_CHECK_SECONDS);
    const id = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          window.clearInterval(id);
          window.setTimeout(onComplete, 0);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [open, onComplete]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Pulse check"
      className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-brand-navy/95 px-6 backdrop-blur"
    >
      <div className="text-2xl font-bold tracking-tight text-brand-white">Pulse check.</div>
      <div className="mt-6 font-mono font-semibold tabular-nums text-[8rem] leading-none text-brand-white">
        {remaining}
      </div>
      <Button variant="secondary" size="md" className="mt-10" onClick={onResume}>
        Resume compressions
      </Button>
    </div>
  );
}
