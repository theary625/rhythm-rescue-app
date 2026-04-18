import { PanelFooter, QuickLinkButton, StepCard } from "./StepCard";

export function PediatricBradycardiaPanel({
  onGoToDrugs,
  onGoToCauses,
}: {
  onGoToDrugs: () => void;
  onGoToCauses: () => void;
}) {
  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-bold tracking-tight text-brand-white">
        Pediatric Bradycardia — With Pulse and Poor Perfusion
      </h2>

      <StepCard title="Step 1 — Identify">
        <p>
          HR &lt; 60/min with signs of poor perfusion despite adequate
          oxygenation and ventilation.
        </p>
      </StepCard>

      <StepCard title="Step 2 — Support ABCs">
        <p>Oxygen, ventilation, monitor, IV/IO.</p>
      </StepCard>

      <StepCard title="Step 3 — If HR < 60 with poor perfusion despite oxygenation/ventilation">
        <p>Begin CPR.</p>
      </StepCard>

      <StepCard title="Step 4 — If bradycardia persists">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Epinephrine 0.01 mg/kg IV/IO every 3–5 minutes (0.1 mL/kg of 1:10,000).
            Max single dose 1 mg.
          </li>
          <li>
            Atropine 0.02 mg/kg IV/IO. Minimum 0.1 mg to avoid paradoxical
            bradycardia. Max single dose 0.5 mg. May repeat once. Use for
            vagally mediated bradycardia or AV block.
          </li>
          <li>Consider transcutaneous or transvenous pacing.</li>
        </ul>
        <QuickLinkButton label="Open Drugs" onClick={onGoToDrugs} />
      </StepCard>

      <StepCard title="Step 5 — Identify and treat underlying cause">
        <QuickLinkButton label="Open Causes" onClick={onGoToCauses} />
      </StepCard>

      <PanelFooter />
    </div>
  );
}
