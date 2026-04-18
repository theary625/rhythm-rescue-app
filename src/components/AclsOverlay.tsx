import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/app-context";
import { ADULT_DRUGS, PEDIATRIC_DRUGS, REVERSIBLE_CAUSES } from "@/lib/ahaConstants";
import { AlgorithmTab } from "./AlgorithmBranch";
import { DrugCard } from "./DrugCard";
import { WeightInput } from "./WeightInput";
import { CauseRow } from "./CauseRow";

type Tab = "algorithm" | "drugs" | "causes";

interface Props {
  open: boolean;
  onClose: () => void;
  initialTab?: Tab;
}

export function AclsOverlay({ open, onClose, initialTab = "algorithm" }: Props) {
  const [tab, setTab] = useState<Tab>(initialTab);

  useEffect(() => {
    if (open) setTab(initialTab);
  }, [open, initialTab]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="ACLS reference"
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex h-[85vh] w-full max-w-md flex-col rounded-t-3xl bg-brand-navy text-brand-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex gap-1 rounded-full bg-brand-accent/40 p-1">
            {(["algorithm", "drugs", "causes"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "min-h-10 rounded-full px-4 text-sm font-semibold capitalize transition-colors",
                  tab === t
                    ? "bg-brand-white text-brand-navy"
                    : "text-brand-white/80 hover:text-brand-white",
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {tab === "algorithm" && (
            <AlgorithmTab
              onGoToDrugs={() => setTab("drugs")}
              onGoToCauses={() => setTab("causes")}
            />
          )}
          {tab === "drugs" && <DrugsTab />}
          {tab === "causes" && <CausesTab />}
        </div>
      </div>
    </div>
  );
}

function DrugsTab() {
  const { patientMode, code, setWeight, logEpi, logDrug } = useApp();
  const isAdult = patientMode === "adult";
  const drugs = isAdult ? ADULT_DRUGS : PEDIATRIC_DRUGS;

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-3 pb-2">
        {!isAdult && (
          <WeightInput value={code.patientWeightKg} onChange={setWeight} />
        )}
        {drugs.map((drug) => (
          <DrugCard
            key={drug.name}
            drug={drug}
            weightKg={isAdult ? null : code.patientWeightKg}
            onLogDose={(entry) => {
              if (entry.name === "Epinephrine") logEpi();
              else logDrug(entry);
            }}
          />
        ))}
      </div>
      <div className="sticky bottom-0 -mx-4 mt-3 border-t border-white/10 bg-brand-navy/95 px-4 py-2 text-center text-[11px] text-brand-white/60 backdrop-blur">
        Verify with order, weight, and concentration. Cognitive aid only.
      </div>
    </div>
  );
}

function CausesTab() {
  const { code, toggleCause } = useApp();
  const checked = new Set(code.causesConsidered);
  const sorted = [...REVERSIBLE_CAUSES].sort((a, b) => {
    const ac = checked.has(a.label) ? 1 : 0;
    const bc = checked.has(b.label) ? 1 : 0;
    return ac - bc;
  });

  return (
    <div className="space-y-2">
      <p className="text-sm text-brand-white/80">
        Treat reversible causes. Tap to mark as considered.
      </p>
      {sorted.map((cause) => (
        <CauseRow
          key={cause.label}
          cause={cause}
          checked={checked.has(cause.label)}
          onToggle={() => toggleCause(cause.label)}
        />
      ))}
      <p className="pt-3 text-center text-[10px] text-brand-white/50">
        Cognitive aid. Not a replacement for clinical judgment.
      </p>
    </div>
  );
}
