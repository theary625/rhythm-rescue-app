import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface Props {
  visible: boolean;
  onDismiss: () => void;
}

export function CompressorSwitchBanner({ visible, onDismiss }: Props) {
  useEffect(() => {
    if (!visible) return;
    const t = window.setTimeout(onDismiss, 8000);
    return () => window.clearTimeout(t);
  }, [visible, onDismiss]);

  return (
    <button
      type="button"
      onClick={onDismiss}
      aria-hidden={!visible}
      className={cn(
        "fixed left-0 right-0 top-14 z-30 mx-auto flex h-14 w-full items-center justify-center bg-brand-red px-5 text-center text-base font-bold text-brand-white shadow-lg transition-transform duration-300 ease-out",
        visible ? "translate-y-0" : "-translate-y-full pointer-events-none",
      )}
    >
      Switch compressor. Stay with the rhythm.
    </button>
  );
}
