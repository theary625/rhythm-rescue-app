import { Button } from "./Button";

interface Props {
  open: boolean;
  headline: string;
  body: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "default";
}

export function ConfirmModal({
  open,
  headline,
  body,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-4 pb-6 sm:items-center"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl bg-brand-softblue p-6 text-brand-navy shadow-xl"
      >
        <h2 className="text-2xl font-bold tracking-tight">{headline}</h2>
        <p className="mt-3 text-sm text-brand-navy/70">{body}</p>
        <div className="mt-6 space-y-3">
          <Button variant="primary" size="md" fullWidth onClick={onConfirm}>
            {confirmLabel}
          </Button>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-12 w-full items-center justify-center rounded-2xl text-base font-semibold text-brand-navy hover:bg-brand-navy/10"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
