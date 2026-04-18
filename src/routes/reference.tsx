import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ScreenShell } from "@/components/ScreenShell";
import { AclsOverlay } from "@/components/AclsOverlay";
import { useApp } from "@/lib/app-context";
import { ALGORITHMS, type AlgorithmId, type AlgorithmSection } from "@/lib/algorithms";
import type { PatientMode } from "@/lib/app-context";

export const Route = createFileRoute("/reference")({
  head: () => ({
    meta: [
      { title: "Algorithms — MedNurse CodeAssist" },
      {
        name: "description",
        content:
          "AHA-aligned algorithm reference. Cardiac arrest, peri-arrest, post-arrest. Cognitive aid only.",
      },
    ],
  }),
  component: ReferenceScreen,
});

const SECTION_LABELS: Record<AlgorithmSection, string> = {
  arrest: "Cardiac arrest",
  peri: "Peri-arrest (with pulse)",
  post: "Post-arrest",
};

function ReferenceScreen() {
  const { setPatientMode } = useApp();
  const [open, setOpen] = useState<{ algo: AlgorithmId; mode: PatientMode } | null>(
    null,
  );

  const handleOpen = (algo: AlgorithmId, mode?: PatientMode) => {
    if (mode) setPatientMode(mode);
    setOpen({ algo, mode: mode ?? "adult" });
  };

  const sections: AlgorithmSection[] = ["arrest", "peri", "post"];

  return (
    <ScreenShell>
      <div className="mx-auto max-w-md pb-12">
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex min-h-12 items-center text-sm font-semibold text-brand-softblue hover:text-brand-white"
          >
            ← Home
          </Link>
        </div>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-brand-white">
          Algorithms.
        </h1>
        <p className="mt-1 text-sm text-brand-white/70">
          AHA-aligned reference. Cognitive aid only.
        </p>

        {sections.map((section) => {
          const items = ALGORITHMS.filter((a) => a.section === section);
          return (
            <section key={section} className="mt-8">
              <div className="mb-3 text-[11px] font-bold uppercase tracking-widest text-brand-white/60">
                {SECTION_LABELS[section]}
              </div>
              <div className="space-y-2">
                {items.map((a, i) => (
                  <button
                    key={`${a.id}-${a.cardTitle}-${i}`}
                    type="button"
                    onClick={() => handleOpen(a.id, a.preferredMode)}
                    className="flex w-full items-center gap-3 rounded-2xl border border-brand-softblue/30 bg-brand-navy/60 p-4 text-left transition-colors hover:border-brand-softblue hover:bg-brand-navy"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-base font-bold text-brand-white">
                        {a.cardTitle}
                      </div>
                      <div className="mt-0.5 text-xs text-brand-white/70">
                        {a.description}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 shrink-0 text-brand-softblue" />
                  </button>
                ))}
              </div>
            </section>
          );
        })}

        <p className="pt-10 text-center text-[10px] text-brand-white/50">
          Educational tool. Not an AHA-credential equivalent.
        </p>
      </div>

      <AclsOverlay
        open={open !== null}
        onClose={() => setOpen(null)}
        isReferenceMode
        initialAlgorithm={open?.algo ?? "cardiac-arrest"}
      />
    </ScreenShell>
  );
}
