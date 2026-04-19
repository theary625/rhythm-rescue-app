import { useState } from "react";
import { PanelFooter, QuickLinkButton, StepCard } from "./StepCard";
import { TriageDecision } from "./TriageDecision";
import { WalkthroughBar } from "./SpeakControls";

type Stability = null | "unstable" | "stable";
type Width = null | "narrow-regular" | "narrow-irregular" | "wide-regular" | "wide-irregular";

const TRIAGE_INTRO =
  "Adult tachycardia with a pulse. First, decide if the patient is stable or unstable. Unstable means hypotension, acute altered mental status, signs of shock, ischemic chest discomfort, or acute heart failure caused by the tachycardia.";

function unstableSteps(): string[] {
  return [
    "Patient is unstable. Perform synchronized cardioversion. Sedate if conscious and time allows. Do not delay cardioversion if unstable.",
    "Recommended biphasic energies: narrow regular 50 to 100 joules. Narrow irregular 120 to 200 joules. Wide regular 100 joules. Wide irregular: defibrillation dose, not synchronized.",
    "Identify and treat reversible causes.",
  ];
}

function stableSteps(width: Width): string[] {
  const intro = "Patient is stable. Determine the QRS width. Narrow is less than 0.12 seconds; wide is 0.12 or greater.";
  if (!width) return [intro];
  if (width === "narrow-regular") {
    return [
      intro,
      "Narrow regular complex, likely supraventricular tachycardia. Try vagal maneuvers. Adenosine 6 milligrams rapid I-V push followed by a 20 milliliter saline flush; may repeat 12 milligrams once. If unsuccessful or recurs, rate control with diltiazem or beta-blocker. Consider expert consultation.",
    ];
  }
  if (width === "narrow-irregular") {
    return [
      intro,
      "Narrow irregular complex, likely atrial fibrillation. Rate control with diltiazem or beta-blocker. Consider expert consultation for rhythm strategy.",
    ];
  }
  if (width === "wide-regular") {
    return [
      intro,
      "Wide regular complex. Procainamide 20 to 50 milligrams per minute until the arrhythmia is suppressed, hypotension occurs, QRS prolongs more than 50 percent, or a maximum of 17 milligrams per kilogram is given. Maintenance 1 to 4 milligrams per minute. Alternative: amiodarone 150 milligrams over 10 minutes; repeat as needed to a maximum of 2.2 grams in 24 hours. Consider expert consultation.",
    ];
  }
  // wide-irregular
  return [
    intro,
    "Wide irregular complex. Expert consultation. Consider amiodarone if monomorphic. If polymorphic with long Q-T, treat as torsades with magnesium sulfate.",
  ];
}

export function AdultTachycardiaPanel({
  onGoToDrugs,
  onGoToCauses,
}: {
  onGoToDrugs: () => void;
  onGoToCauses: () => void;
}) {
  const [stability, setStability] = useState<Stability>(null);
  const [width, setWidth] = useState<Width>(null);

  const walkthrough: string[] = (() => {
    if (stability === "unstable") return [TRIAGE_INTRO, ...unstableSteps()];
    if (stability === "stable") return [TRIAGE_INTRO, ...stableSteps(width)];
    return [TRIAGE_INTRO];
  })();

  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-bold tracking-tight text-brand-white">
        Adult Tachycardia — With Pulse
      </h2>

      <WalkthroughBar steps={walkthrough} />

      <TriageDecision
        prompt="Stable or unstable?"
        leftLabel="Unstable"
        rightLabel="Stable"
        onSelect={(c) => {
          setStability(c === "left" ? "unstable" : "stable");
          setWidth(null);
        }}
      />

      <p className="px-1 text-xs text-brand-white/70">
        Unstable = hypotension, acute altered mental status, signs of shock,
        ischemic chest discomfort, or acute heart failure caused by the tachycardia.
      </p>

      {stability === "unstable" && (
        <>
          <StepCard
            title="Step 1 — Synchronized cardioversion"
            speak="Synchronized cardioversion. Sedate if conscious and time allows. Do not delay cardioversion if unstable."
          >
            <p>Sedate if conscious and time allows. Do not delay cardioversion if unstable.</p>
          </StepCard>
          <StepCard
            title="Step 2 — Recommended energies (biphasic)"
            speak="Recommended biphasic energies: narrow regular 50 to 100 joules. Narrow irregular 120 to 200 joules. Wide regular 100 joules. Wide irregular: defibrillation dose, not synchronized."
          >
            <ul className="list-disc space-y-1 pl-5">
              <li>Narrow regular: 50–100 J</li>
              <li>Narrow irregular: 120–200 J</li>
              <li>Wide regular: 100 J</li>
              <li>Wide irregular: defibrillation dose (NOT synchronized)</li>
            </ul>
          </StepCard>
          <StepCard
            title="Step 3 — Identify and treat reversible causes"
            speak="Identify and treat reversible causes."
          >
            <QuickLinkButton label="Open Causes" onClick={onGoToCauses} />
          </StepCard>
          <PanelFooter />
        </>
      )}

      {stability === "stable" && (
        <>
          <TriageDecision
            prompt="Narrow complex (QRS < 0.12 s) or wide?"
            leftLabel="Narrow"
            rightLabel="Wide"
            onSelect={(c) =>
              setWidth(c === "left" ? "narrow-regular" : "wide-regular")
            }
          />

          {(width === "narrow-regular" || width === "narrow-irregular") && (
            <TriageDecision
              prompt="Regular or irregular?"
              leftLabel="Regular (likely SVT)"
              rightLabel="Irregular (likely AF)"
              onSelect={(c) =>
                setWidth(c === "left" ? "narrow-regular" : "narrow-irregular")
              }
            />
          )}

          {(width === "wide-regular" || width === "wide-irregular") && (
            <TriageDecision
              prompt="Regular or irregular?"
              leftLabel="Regular"
              rightLabel="Irregular"
              onSelect={(c) =>
                setWidth(c === "left" ? "wide-regular" : "wide-irregular")
              }
            />
          )}

          {width === "narrow-regular" && (
            <>
              <StepCard
                title="Narrow regular (likely SVT)"
                speak="Narrow regular complex, likely S-V-T. Try vagal maneuvers. Adenosine 6 milligrams rapid I-V push, follow with 20 milliliter saline flush; may repeat 12 milligrams once. If unsuccessful or recurs, rate control with diltiazem or beta-blocker. Consider expert consultation."
              >
                <ul className="list-disc space-y-1 pl-5">
                  <li>Vagal maneuvers.</li>
                  <li>
                    Adenosine 6 mg rapid IV push, follow with 20 mL saline flush.
                    May repeat 12 mg once.
                  </li>
                  <li>
                    If unsuccessful or recurs: rate control with diltiazem or
                    beta-blocker. Consider expert consultation.
                  </li>
                </ul>
                <QuickLinkButton label="Open Drugs" onClick={onGoToDrugs} />
              </StepCard>
              <PanelFooter />
            </>
          )}

          {width === "narrow-irregular" && (
            <>
              <StepCard
                title="Narrow irregular (likely atrial fibrillation)"
                speak="Narrow irregular complex, likely atrial fibrillation. Rate control with diltiazem or beta-blocker. Consider expert consultation for rhythm strategy."
              >
                <ul className="list-disc space-y-1 pl-5">
                  <li>Rate control: diltiazem or beta-blocker.</li>
                  <li>Consider expert consultation for rhythm strategy.</li>
                </ul>
                <QuickLinkButton label="Open Drugs" onClick={onGoToDrugs} />
              </StepCard>
              <PanelFooter />
            </>
          )}

          {width === "wide-regular" && (
            <>
              <StepCard
                title="Wide regular"
                speak="Wide regular complex. Procainamide 20 to 50 milligrams per minute until arrhythmia suppressed, hypotension occurs, QRS prolongs more than 50 percent, or a maximum of 17 milligrams per kilogram is given. Maintenance 1 to 4 milligrams per minute. Alternative: amiodarone 150 milligrams over 10 minutes. Consider expert consultation."
              >
                <ul className="list-disc space-y-1 pl-5">
                  <li>
                    Procainamide 20–50 mg/min until arrhythmia suppressed,
                    hypotension occurs, QRS prolonged &gt; 50%, or max 17 mg/kg
                    given. Maintenance 1–4 mg/min.
                  </li>
                  <li>
                    Alternative: amiodarone 150 mg over 10 minutes; repeat as
                    needed to max 2.2 g/24 h. Maintenance 1 mg/min for first 6 hours.
                  </li>
                  <li>Consider expert consultation.</li>
                </ul>
                <QuickLinkButton label="Open Drugs" onClick={onGoToDrugs} />
              </StepCard>
              <PanelFooter />
            </>
          )}

          {width === "wide-irregular" && (
            <>
              <StepCard
                title="Wide irregular"
                speak="Wide irregular complex. Expert consultation. Consider amiodarone if monomorphic. If polymorphic with long Q-T, treat as torsades with magnesium sulfate."
              >
                <ul className="list-disc space-y-1 pl-5">
                  <li>Expert consultation.</li>
                  <li>Consider amiodarone if monomorphic.</li>
                  <li>
                    Polymorphic + long QT: treat as torsades — magnesium sulfate.
                  </li>
                </ul>
              </StepCard>
              <PanelFooter />
            </>
          )}
        </>
      )}
    </div>
  );
}
