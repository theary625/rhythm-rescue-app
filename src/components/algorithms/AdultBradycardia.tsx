import { PanelFooter, QuickLinkButton, StepCard } from "./StepCard";
import { WalkthroughBar } from "./SpeakControls";

const STEPS: { title: string; speak: string }[] = [
  {
    title: "Step 1 — Identify",
    speak:
      "Identify symptomatic bradycardia. Heart rate less than 50 with hypotension, altered mental status, ischemic chest discomfort, acute heart failure, or shock.",
  },
  {
    title: "Step 2 — Stabilize",
    speak:
      "Maintain airway. Assist breathing as needed. Give oxygen if hypoxemic. Cardiac monitor. I-V access. Twelve lead E-C-G.",
  },
  {
    title: "Step 3 — If symptomatic and adequate perfusion",
    speak: "If perfusion is adequate, monitor and observe.",
  },
  {
    title: "Step 4 — If symptomatic and inadequate perfusion",
    speak:
      "Atropine 1 milligram I-V bolus, repeat every 3 to 5 minutes, maximum 3 milligrams. If atropine is ineffective: transcutaneous pacing, or dopamine infusion 5 to 20 micrograms per kilogram per minute, or epinephrine infusion 2 to 10 micrograms per minute.",
  },
  {
    title: "Step 5 — Identify and treat underlying cause",
    speak: "Identify and treat the underlying cause. The H's and T's still apply.",
  },
  {
    title: "Step 6 — Consider expert consultation",
    speak: "Consider expert consultation. Transvenous pacing if persistent.",
  },
];

export function AdultBradycardiaPanel({
  onGoToDrugs,
  onGoToCauses,
}: {
  onGoToDrugs: () => void;
  onGoToCauses: () => void;
}) {
  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-bold tracking-tight text-brand-white">
        Adult Bradycardia — Symptomatic
      </h2>

      <WalkthroughBar steps={STEPS.map((s) => s.speak)} />

      <StepCard title={STEPS[0].title} speak={STEPS[0].speak}>
        <p>
          HR &lt; 50/min with signs of poor perfusion: hypotension, altered mental
          status, ischemic chest discomfort, acute heart failure, shock.
        </p>
      </StepCard>

      <StepCard title={STEPS[1].title} speak={STEPS[1].speak}>
        <p>
          Maintain airway. Assist breathing as needed. O₂ if hypoxemic. Cardiac
          monitor. IV access. 12-lead ECG.
        </p>
      </StepCard>

      <StepCard title={STEPS[2].title} speak={STEPS[2].speak}>
        <p>Monitor and observe.</p>
      </StepCard>

      <StepCard title={STEPS[3].title} speak={STEPS[3].speak}>
        <ul className="list-disc space-y-1 pl-5">
          <li>Atropine 1 mg IV bolus. Repeat every 3–5 minutes. Maximum 3 mg.</li>
          <li>
            If atropine ineffective: transcutaneous pacing, OR dopamine infusion
            5–20 mcg/kg/min, OR epinephrine infusion 2–10 mcg/min.
          </li>
        </ul>
        <QuickLinkButton label="Open Drugs" onClick={onGoToDrugs} />
      </StepCard>

      <StepCard title={STEPS[4].title} speak={STEPS[4].speak}>
        <p>H's &amp; T's still apply.</p>
        <QuickLinkButton label="Open Causes" onClick={onGoToCauses} />
      </StepCard>

      <StepCard title={STEPS[5].title} speak={STEPS[5].speak}>
        <p>Transvenous pacing if persistent.</p>
      </StepCard>

      <PanelFooter />
    </div>
  );
}
