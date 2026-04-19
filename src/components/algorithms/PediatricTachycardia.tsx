import { useState } from "react";
import { PanelFooter, QuickLinkButton, StepCard } from "./StepCard";
import { TriageDecision } from "./TriageDecision";
import { WalkthroughBar } from "./SpeakControls";

type Perfusion = null | "inadequate" | "adequate";
type Branch = null | "narrow-sinus" | "narrow-svt" | "wide";

const TRIAGE_INTRO =
  "Pediatric tachycardia with a pulse. First decide: is perfusion adequate or inadequate?";

function buildWalkthrough(perf: Perfusion, branch: Branch): string[] {
  if (perf === "inadequate") {
    return [
      TRIAGE_INTRO,
      "Perfusion is inadequate. Perform synchronized cardioversion. 0.5 to 1 joule per kilogram for the first dose. Increase to 2 joules per kilogram if no response. Sedate if possible, but do not delay cardioversion for sedation if unstable.",
    ];
  }
  if (perf === "adequate") {
    const intro2 =
      "Perfusion is adequate. Determine QRS width. Narrow is 0.09 seconds or less. Wide is greater than 0.09 seconds.";
    if (branch === "narrow-sinus") {
      return [
        TRIAGE_INTRO,
        intro2,
        "Likely sinus tachycardia. Heart rate usually less than 220 in infants and less than 180 in children, with an identifiable cause. Treat the cause.",
      ];
    }
    if (branch === "narrow-svt") {
      return [
        TRIAGE_INTRO,
        intro2,
        "Likely supraventricular tachycardia. Heart rate usually 220 or greater in infants, 180 or greater in children. Abrupt onset and offset. P waves absent or abnormal. Try vagal maneuvers — no carotid massage in pediatrics. Adenosine 0.1 milligrams per kilogram I-V or I-O rapid push, maximum first dose 6 milligrams. Second dose 0.2 milligrams per kilogram, maximum 12 milligrams. Synchronized cardioversion if adenosine fails and the patient becomes unstable.",
      ];
    }
    if (branch === "wide") {
      return [
        TRIAGE_INTRO,
        intro2,
        "Wide complex, likely ventricular tachycardia with pulse. Expert consultation strongly recommended. Amiodarone 5 milligrams per kilogram I-V or I-O over 20 to 60 minutes, or procainamide 15 milligrams per kilogram I-V or I-O over 30 to 60 minutes. Do not give both.",
      ];
    }
    return [TRIAGE_INTRO, intro2];
  }
  return [TRIAGE_INTRO];
}

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

      <WalkthroughBar steps={buildWalkthrough(perf, branch)} />

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
          <StepCard
            title="Synchronized cardioversion"
            speak="Synchronized cardioversion. 0.5 to 1 joule per kilogram for the first dose. Increase to 2 joules per kilogram if no response. Sedate if possible. Do not delay cardioversion for sedation if unstable."
          >
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
              <StepCard
                title="Likely sinus tachycardia"
                speak="Likely sinus tachycardia. Heart rate usually less than 220 in infants, less than 180 in children, with an identifiable cause. Treat the cause."
              >
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
              <StepCard
                title="Likely SVT"
                speak="Likely S-V-T. Heart rate usually 220 or greater in infants, 180 or greater in children. Vagal maneuvers — no carotid massage in pediatrics. Adenosine 0.1 milligrams per kilogram I-V or I-O rapid push; maximum first dose 6 milligrams. Second dose 0.2 milligrams per kilogram, maximum 12 milligrams. Synchronized cardioversion if adenosine fails and the patient becomes unstable."
              >
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
              <StepCard
                title="Wide complex (likely VT with pulse)"
                speak="Wide complex, likely ventricular tachycardia with pulse. Expert consultation strongly recommended. Amiodarone 5 milligrams per kilogram I-V or I-O over 20 to 60 minutes, or procainamide 15 milligrams per kilogram I-V or I-O over 30 to 60 minutes. Do not give both."
              >
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
