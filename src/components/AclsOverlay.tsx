import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/app-context";
import { REVERSIBLE_CAUSES } from "@/lib/ahaConstants";
import {
  algoFromChip,
  chipIdFor,
  drugsForAlgorithm,
  type AlgorithmId,
} from "@/lib/algorithms";
import { AlgorithmTab } from "./AlgorithmBranch";
import { AlgorithmChipRow } from "./AlgorithmChipRow";
import { AdultBradycardiaPanel } from "./algorithms/AdultBradycardia";
import { AdultTachycardiaPanel } from "./algorithms/AdultTachycardia";
import { AdultPostArrestPanel } from "./algorithms/AdultPostArrest";
import { PediatricBradycardiaPanel } from "./algorithms/PediatricBradycardia";
import { PediatricTachycardiaPanel } from "./algorithms/PediatricTachycardia";
import { DrugCard } from "./DrugCard";
import { WeightInput } from "./WeightInput";
import { CauseRow } from "./CauseRow";

type Tab = "algorithm" | "drugs" | "causes";

interface Props {
  open: boolean;
  onClose: () => void;
  initialTab?: Tab;
  /** When true: no logging, no session-coupled UI. */
  isReferenceMode?: boolean;
  /** Algorithm to render initially (used by /reference). */
  initialAlgorithm?: AlgorithmId;
}

export function AclsOverlay({
  open,
  onClose,
  initialTab = "algorithm",
  isReferenceMode = false,
  initialAlgorithm = "cardiac-arrest",
}: Props) {
  const { patientMode } = useApp();
  const [tab, setTab] = useState<Tab>(initialTab);
  const [chip, setChip] = useState<AlgorithmId>(chipIdFor(initialAlgorithm, patientMode));

  useEffect(() => {
    if (open) {
      setTab(initialTab);
      setChip(chipIdFor(initialAlgorithm, patientMode));
    }
  }, [open, initialTab, initialAlgorithm, patientMode]);

  if (!open) return null;

  const algorithm = algoFromChip(chip, patientMode);

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
        className="flex h-[90vh] w-full max-w-md flex-col rounded-t-3xl bg-brand-navy text-brand-white shadow-2xl"
      >
        <div className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-2">
          <div className="min-w-0 flex-1">
            <AlgorithmChipRow value={chip} onChange={setChip} />
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center gap-1 border-b border-white/10 px-3 py-2">
          <div className="flex gap-1 rounded-full bg-brand-accent/40 p-1">
            {(["algorithm", "drugs", "causes"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "min-h-9 rounded-full px-3 text-xs font-semibold capitalize transition-colors",
                  tab === t
                    ? "bg-brand-white text-brand-navy"
                    : "text-brand-white/80 hover:text-brand-white",
                )}
              >
                {t}
              </button>
            ))}
          </div>
          {isReferenceMode && (
            <span className="ml-auto text-[10px] font-semibold uppercase tracking-widest text-brand-white/60">
              Reference walkthrough
            </span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {tab === "algorithm" && (
            <AlgorithmPanel
              algorithm={algorithm}
              isReferenceMode={isReferenceMode}
              onGoToDrugs={() => setTab("drugs")}
              onGoToCauses={() => setTab("causes")}
            />
          )}
          {tab === "drugs" && (
            <DrugsTab algorithm={algorithm} isReferenceMode={isReferenceMode} />
          )}
          {tab === "causes" && <CausesTab isReferenceMode={isReferenceMode} />}
        </div>
      </div>
    </div>
  );
}

function AlgorithmPanel({
  algorithm,
  isReferenceMode,
  onGoToDrugs,
  onGoToCauses,
}: {
  algorithm: AlgorithmId;
  isReferenceMode: boolean;
  onGoToDrugs: () => void;
  onGoToCauses: () => void;
}) {
  if (algorithm === "cardiac-arrest") {
    return (
      <AlgorithmTab
        onGoToDrugs={onGoToDrugs}
        onGoToCauses={onGoToCauses}
        isReferenceMode={isReferenceMode}
      />
    );
  }
  if (algorithm === "adult-bradycardia") {
    return (
      <AdultBradycardiaPanel onGoToDrugs={onGoToDrugs} onGoToCauses={onGoToCauses} />
    );
  }
  if (algorithm === "adult-tachycardia") {
    return (
      <AdultTachycardiaPanel onGoToDrugs={onGoToDrugs} onGoToCauses={onGoToCauses} />
    );
  }
  if (algorithm === "adult-post-arrest") {
    return <AdultPostArrestPanel onGoToCauses={onGoToCauses} />;
  }
  if (algorithm === "pediatric-bradycardia") {
    return (
      <PediatricBradycardiaPanel
        onGoToDrugs={onGoToDrugs}
        onGoToCauses={onGoToCauses}
      />
    );
  }
  if (algorithm === "pediatric-tachycardia") {
    return (
      <PediatricTachycardiaPanel
        onGoToDrugs={onGoToDrugs}
        onGoToCauses={onGoToCauses}
      />
    );
  }
  return null;
}

function DrugsTab({
  algorithm,
  isReferenceMode,
}: {
  algorithm: AlgorithmId;
  isReferenceMode: boolean;
}) {
  const { patientMode, code, setWeight, logEpi, logDrug } = useApp();
  const isAdult = patientMode === "adult";
  const drugs = drugsForAlgorithm(algorithm, patientMode);
  const isArrest = algorithm === "cardiac-arrest";
  const showWeight = isArrest && !isAdult;

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-3 pb-2">
        {showWeight && (
          <WeightInput value={code.patientWeightKg} onChange={setWeight} />
        )}
        {drugs.map((drug) => (
          <DrugCard
            key={drug.name}
            drug={drug}
            weightKg={isArrest && !isAdult ? code.patientWeightKg : null}
            onLogDose={
              isReferenceMode
                ? undefined
                : (entry) => {
                    if (entry.name === "Epinephrine") logEpi();
                    else logDrug(entry);
                  }
            }
          />
        ))}
        {isReferenceMode && (
          <p className="px-1 pt-1 text-center text-[11px] text-brand-white/60">
            Log doses on the Active Code screen.
          </p>
        )}
      </div>
      <div className="sticky bottom-0 -mx-4 mt-3 border-t border-white/10 bg-brand-navy/95 px-4 py-2 text-center text-[11px] text-brand-white/60 backdrop-blur">
        {isReferenceMode
          ? "Educational tool. Not an AHA-credential equivalent."
          : "Verify with order, weight, and concentration. Cognitive aid only."}
      </div>
    </div>
  );
}

function CausesTab({ isReferenceMode }: { isReferenceMode: boolean }) {
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
        Treat reversible causes.{" "}
        {isReferenceMode ? "Reference list." : "Tap to mark as considered."}
      </p>
      {sorted.map((cause) => (
        <CauseRow
          key={cause.label}
          cause={cause}
          checked={checked.has(cause.label)}
          onToggle={isReferenceMode ? () => {} : () => toggleCause(cause.label)}
        />
      ))}
      <p className="pt-3 text-center text-[10px] text-brand-white/50">
        Cognitive aid. Not a replacement for clinical judgment.
      </p>
    </div>
  );
}
