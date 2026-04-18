import { Button } from "./Button";

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (rhythm: "shockable" | "non-shockable") => void;
}

export function RhythmChooserSheet({ open, onClose, onSelect }: Props) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Rhythm check"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-4 pb-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-brand-navy p-6 text-brand-white shadow-2xl"
      >
        <h2 className="text-xl font-bold tracking-tight">What rhythm are you treating?</h2>
        <div className="mt-5 space-y-3">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => onSelect("shockable")}
          >
            Shockable (VF / pulseless VT)
          </Button>
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={() => onSelect("non-shockable")}
          >
            Non-shockable (Asystole / PEA)
          </Button>
        </div>
        <p className="mt-4 text-center text-xs text-brand-white/60">
          You can change this at the next rhythm check.
        </p>
      </div>
    </div>
  );
}
