import type { ReactNode } from "react";

export function StepCard({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-2xl bg-brand-accent/15 p-4">
      <div className="text-sm font-bold tracking-tight text-brand-white">{title}</div>
      {children && <div className="mt-2 space-y-2 text-sm text-brand-white/85">{children}</div>}
    </div>
  );
}

export function PanelFooter({ extra }: { extra?: string }) {
  return (
    <>
      {extra && (
        <p className="pt-2 text-center text-[11px] font-semibold text-brand-white/70">
          {extra}
        </p>
      )}
      <p className="pt-1 text-center text-[10px] text-brand-white/50">
        AHA ACLS reference. Cognitive aid only. Follow your code team and orders.
      </p>
    </>
  );
}

export function QuickLinkButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-2 inline-flex h-12 items-center justify-center rounded-2xl border-2 border-brand-accent px-4 text-sm font-bold text-brand-white hover:bg-brand-accent/20"
    >
      {label}
    </button>
  );
}
