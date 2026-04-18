import { Mic } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  active: boolean;
  onToggleOff: () => void;
}

export function MicIndicator({ active, onToggleOff }: Props) {
  if (!active) return null;
  return (
    <button
      type="button"
      aria-label="Hands-free listening — tap to stop"
      onClick={onToggleOff}
      className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-red text-brand-white"
    >
      <span
        aria-hidden
        className="absolute inset-0 animate-ping rounded-full bg-brand-red/60"
      />
      <Mic className={cn("relative h-5 w-5")} />
    </button>
  );
}
