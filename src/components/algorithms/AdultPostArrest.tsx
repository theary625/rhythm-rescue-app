import { PanelFooter, QuickLinkButton, StepCard } from "./StepCard";
import { WalkthroughBar } from "./SpeakControls";
import { POST_ARREST_FOOTER } from "@/lib/algorithms";

const STEPS: { title: string; speak: string }[] = [
  {
    title: "Step 1 — Optimize ventilation and oxygenation",
    speak:
      "Optimize ventilation and oxygenation. Target oxygen saturation 92 to 98 percent. PaCO2 35 to 45. Avoid hyperventilation. Use advanced airway and waveform capnography as appropriate.",
  },
  {
    title: "Step 2 — Treat hypotension",
    speak:
      "Treat hypotension. Target mean arterial pressure at or above 65. Give 1 to 2 liters of isotonic crystalloid I-V or I-O bolus. Vasopressors: epinephrine, dopamine, or norepinephrine infusion.",
  },
  {
    title: "Step 3 — 12-lead ECG",
    speak:
      "Obtain a 12-lead E-C-G. If S-T E-M-I is present, activate the cath lab and treat per local protocol.",
  },
  {
    title: "Step 4 — Targeted Temperature Management (TTM)",
    speak:
      "Targeted temperature management for comatose patients post return of spontaneous circulation. Maintain a constant temperature between 32 and 36 degrees Celsius for at least 24 hours.",
  },
  {
    title: "Step 5 — Continued critical care",
    speak:
      "Continued critical care. Glucose control, sedation, neurologic assessment, and prognostication delayed at least 72 hours.",
  },
  {
    title: "Step 6 — Identify and treat reversible causes",
    speak: "Identify and treat reversible causes.",
  },
];

export function AdultPostArrestPanel({ onGoToCauses }: { onGoToCauses: () => void }) {
  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-bold tracking-tight text-brand-white">
        Adult Post-Cardiac-Arrest Care
      </h2>

      <WalkthroughBar steps={STEPS.map((s) => s.speak)} />

      <StepCard title={STEPS[0].title} speak={STEPS[0].speak}>
        <ul className="list-disc space-y-1 pl-5">
          <li>SpO₂ 92–98%.</li>
          <li>PaCO₂ 35–45 mmHg (avoid hyperventilation).</li>
          <li>Advanced airway and waveform capnography as appropriate.</li>
        </ul>
      </StepCard>

      <StepCard title={STEPS[1].title} speak={STEPS[1].speak}>
        <ul className="list-disc space-y-1 pl-5">
          <li>Mean arterial pressure ≥ 65 mmHg.</li>
          <li>IV/IO bolus 1–2 L isotonic crystalloid.</li>
          <li>Vasopressor: epinephrine, dopamine, or norepinephrine infusion.</li>
        </ul>
      </StepCard>

      <StepCard title={STEPS[2].title} speak={STEPS[2].speak}>
        <p>STEMI present? → activate cath lab and treat per local protocol.</p>
      </StepCard>

      <StepCard title={STEPS[3].title} speak={STEPS[3].speak}>
        <ul className="list-disc space-y-1 pl-5">
          <li>For comatose patients post-ROSC.</li>
          <li>Maintain constant temperature 32–36°C for at least 24 hours.</li>
        </ul>
      </StepCard>

      <StepCard title={STEPS[4].title} speak={STEPS[4].speak}>
        <p>
          Glucose control, sedation, neuro assessment, prognostication delayed
          ≥ 72 hours.
        </p>
      </StepCard>

      <StepCard title={STEPS[5].title} speak={STEPS[5].speak}>
        <QuickLinkButton label="Open Causes" onClick={onGoToCauses} />
      </StepCard>

      <PanelFooter extra={POST_ARREST_FOOTER} />
    </div>
  );
}
