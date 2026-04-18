import { useState } from "react";
import { PanelFooter, QuickLinkButton, StepCard } from "./StepCard";
import { TriageDecision } from "./TriageDecision";

type Perfusion = null | "inadequate" | "adequate";
type Branch = null | "narrow-sinus" | "narrow-svt" | "wide";

export function PediatricTachycardiaPanel({
  onGoToDrugs,
}: {
  onGoToDrugs: () => void;
  onGoToCauses?: () => void;
}) {
  const [perf, setPerf] = useState<Perfusion>(null);
  const [branch, setBranch] = useState<Branch>(null);

  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-bold tracking-tight text-brand-white">
        Pediatric Tachycardia — With Pulse
      </h2>

      <TriageDecision
        prompt="Adequate or inadequate perfusion?"
        leftLabel="Inadequate"
        rightLabel="Adequate"
        onSelect={(c) => {
          setPerf(c === "left" ? "inadequate" : "adequate");
          setBranch(null);
        }}
      />

      {perf === "inadequate" && (
        <>
          <StepCard title="Synchronized cardioversion">
            <ul className="list-disc space-y-1 pl-5">
              <li>0.5–1 J/kg first dose, increase to 2 J/kg if no response.</li>
              <li>
                Sedate if possible. Do not delay cardioversion for sedation if
                unstable.
              </li>
            </ul>
          </StepCard>
          <PanelFooter />
        </>
      )}

      {perf === "adequate" && (
        <>
          <p className="px-1 text-xs text-brand-white/70">
            Determine width: narrow (≤ 0.09 s) or wide (&gt; 0.09 s).
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => setBranch("narrow-sinus")}
              className="inline-flex min-h-14 items-center justify-center rounded-2xl border-2 border-brand-accent px-3 text-sm font-bold text-brand-white hover:bg-brand-accent/20"
            >
              Narrow — sinus
            </button>
            <button
              type="button"
              onClick={() => setBranch("narrow-svt")}
              className="inline-flex min-h-14 items-center justify-center rounded-2xl border-2 border-brand-accent px-3 text-sm font-bold text-brand-white hover:bg-brand-accent/20"
            >
              Narrow — SVT
            </button>
            <button
              type="button"
              onClick={() => setBranch("wide")}
              className="inline-flex min-h-14 items-center justify-center rounded-2xl border-2 border-brand-accent px-3 text-sm font-bold text-brand-white hover:bg-brand-accent/20"
            >
              Wide complex
            </button>
          </div>

          {branch === "narrow-sinus" && (
            <>
              <StepCard title="Likely sinus tachycardia">
                <p>
                  HR usually &lt; 220 in infants, &lt; 180 in children, with
                  identifiable cause. Treat the cause.
                </p>
              </StepCard>
              <PanelFooter />
            </>
          )}

          {branch === "narrow-svt" && (
            <>
              <StepCard title="Likely SVT">
                <ul className="list-disc space-y-1 pl-5">
                  <li>
                    HR usually ≥ 220 in infants, ≥ 180 in children. Abrupt
                    onset/offset, P waves absent or abnormal.
                  </li>
                  <li>Vagal maneuvers — no carotid massage in pediatrics.</li>
                  <li>
                    Adenosine 0.1 mg/kg IV/IO rapid push (max first dose 6 mg).
                    Second dose 0.2 mg/kg (max 12 mg).
                  </li>
                  <li>
                    Synchronized cardioversion if adenosine fails and patient
                    becomes unstable.
                  </li>
                </ul>
                <QuickLinkButton label="Open Drugs" onClick={onGoToDrugs} />
              </StepCard>
              <PanelFooter />
            </>
          )}

          {branch === "wide" && (
            <>
              <StepCard title="Wide complex (likely VT with pulse)">
                <ul className="list-disc space-y-1 pl-5">
                  <li>Expert consultation strongly recommended.</li>
                  <li>
                    Amiodarone 5 mg/kg IV/IO over 20–60 min, OR procainamide
                    15 mg/kg IV/IO over 30–60 min. Do not give both.
                  </li>
                </ul>
                <QuickLinkButton label="Open Drugs" onClick={onGoToDrugs} />
              </StepCard>
              <PanelFooter />
            </>
          )}
        </>
      )}
    </div>
  );
}
