import { PanelFooter, QuickLinkButton, StepCard } from "./StepCard";

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

      <StepCard title="Step 1 — Identify">
        <p>
          HR &lt; 50/min with signs of poor perfusion: hypotension, altered mental
          status, ischemic chest discomfort, acute heart failure, shock.
        </p>
      </StepCard>

      <StepCard title="Step 2 — Stabilize">
        <p>
          Maintain airway. Assist breathing as needed. O₂ if hypoxemic. Cardiac
          monitor. IV access. 12-lead ECG.
        </p>
      </StepCard>

      <StepCard title="Step 3 — If symptomatic and adequate perfusion">
        <p>Monitor and observe.</p>
      </StepCard>

      <StepCard title="Step 4 — If symptomatic and inadequate perfusion">
        <ul className="list-disc space-y-1 pl-5">
          <li>Atropine 1 mg IV bolus. Repeat every 3–5 minutes. Maximum 3 mg.</li>
          <li>
            If atropine ineffective: transcutaneous pacing, OR dopamine infusion
            5–20 mcg/kg/min, OR epinephrine infusion 2–10 mcg/min.
          </li>
        </ul>
        <QuickLinkButton label="Open Drugs" onClick={onGoToDrugs} />
      </StepCard>

      <StepCard title="Step 5 — Identify and treat underlying cause">
        <p>H's &amp; T's still apply.</p>
        <QuickLinkButton label="Open Causes" onClick={onGoToCauses} />
      </StepCard>

      <StepCard title="Step 6 — Consider expert consultation">
        <p>Transvenous pacing if persistent.</p>
      </StepCard>

      <PanelFooter />
    </div>
  );
}
