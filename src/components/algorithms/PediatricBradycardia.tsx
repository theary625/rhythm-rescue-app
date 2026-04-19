import { PanelFooter, QuickLinkButton, StepCard } from "./StepCard";
import { WalkthroughBar } from "./SpeakControls";

const STEPS: { title: string; speak: string }[] = [
  {
    title: "Step 1 — Identify",
    speak:
      "Heart rate less than 60 per minute with signs of poor perfusion despite adequate oxygenation and ventilation.",
  },
  {
    title: "Step 2 — Support ABCs",
    speak: "Support airway, breathing, and circulation. Oxygen, ventilation, monitor, I-V or I-O access.",
  },
  {
    title: "Step 3 — If HR < 60 with poor perfusion despite oxygenation/ventilation",
    speak:
      "If heart rate remains less than 60 with poor perfusion despite adequate oxygenation and ventilation, begin C-P-R.",
  },
  {
    title: "Step 4 — If bradycardia persists",
    speak:
      "Epinephrine 0.01 milligrams per kilogram I-V or I-O every 3 to 5 minutes; that's 0.1 milliliters per kilogram of 1 to 10,000. Maximum single dose 1 milligram. Atropine 0.02 milligrams per kilogram I-V or I-O. Minimum dose 0.1 milligrams to avoid paradoxical bradycardia. Maximum single dose 0.5 milligrams. May repeat once. Consider transcutaneous or transvenous pacing.",
  },
  {
    title: "Step 5 — Identify and treat underlying cause",
    speak: "Identify and treat the underlying cause.",
  },
];

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

      <WalkthroughBar steps={STEPS.map((s) => s.speak)} />

      <StepCard title={STEPS[0].title} speak={STEPS[0].speak}>
        <p>
          HR &lt; 60/min with signs of poor perfusion despite adequate
          oxygenation and ventilation.
        </p>
      </StepCard>

      <StepCard title={STEPS[1].title} speak={STEPS[1].speak}>
        <p>Oxygen, ventilation, monitor, IV/IO.</p>
      </StepCard>

      <StepCard title={STEPS[2].title} speak={STEPS[2].speak}>
        <p>Begin CPR.</p>
      </StepCard>

      <StepCard title={STEPS[3].title} speak={STEPS[3].speak}>
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

      <StepCard title={STEPS[4].title} speak={STEPS[4].speak}>
        <QuickLinkButton label="Open Causes" onClick={onGoToCauses} />
      </StepCard>

      <PanelFooter />
    </div>
  );
}
