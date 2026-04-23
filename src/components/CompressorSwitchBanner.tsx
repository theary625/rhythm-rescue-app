import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  visible: boolean;
  onDismiss: () => void;
  onRhythmCheck: () => void;
  colorBlind?: boolean;
  compact?: boolean;
}

export function CompressorSwitchBanner({
  visible,
  onDismiss,
  onRhythmCheck,
  colorBlind = false,
  compact = false,
}: Props) {
  useEffect(() => {
    if (!visible) return;
    const t = window.setTimeout(onDismiss, 8000);
    return () => window.clearTimeout(t);
  }, [visible, onDismiss]);

  return (
    <button
      type="button"
      onClick={() => {
        onRhythmCheck();
        onDismiss();
      }}
      aria-hidden={!visible}
      style={{
        top: `calc(env(safe-area-inset-top) + ${compact ? "4rem" : "3.5rem"})`,
        transform: visible
          ? "translateY(0)"
          : `translateY(calc(-100% - env(safe-area-inset-top) - ${compact ? "4rem" : "3.5rem"}))`,
      }}
      className={cn(
        "fixed left-0 right-0 z-30 mx-auto flex w-full flex-col items-center justify-center gap-0.5 bg-brand-red px-5 py-3 text-center text-brand-white shadow-lg transition-transform duration-300 ease-out",
        colorBlind && "border-y-2 border-dotted border-white",
        !visible && "pointer-events-none",
      )}
    >
      <span className="flex items-center gap-2 text-base font-bold leading-tight">
        {colorBlind && <AlertTriangle className="h-4 w-4" aria-hidden />}
        Switch compressor. Stay with the rhythm.
      </span>
      <span className="text-xs font-semibold opacity-90">Rhythm check.</span>
    </button>
  );
}
