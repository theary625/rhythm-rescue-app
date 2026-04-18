import type { ReactNode } from "react";

interface Props {
  index: number;
  total: number;
  headline: string;
  children: ReactNode;
  actions: ReactNode;
}

export function OnboardingPanel({ index, total, headline, children, actions }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-brand-softblue text-brand-navy"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="flex items-center justify-center gap-1.5 pt-4">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            aria-hidden
            className={
              "h-1.5 rounded-full transition-all " +
              (i === index ? "w-6 bg-brand-red" : "w-1.5 bg-brand-navy/30")
            }
          />
        ))}
      </div>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-6">
        <h1 className="text-4xl font-bold leading-tight tracking-tight">{headline}</h1>
        <div className="mt-6 flex-1 space-y-4 text-base leading-relaxed text-brand-navy/80">
          {children}
        </div>
        <div className="pt-6">{actions}</div>
      </main>
    </div>
  );
}
