import { PanelFooter, QuickLinkButton, StepCard } from "./StepCard";
import { POST_ARREST_FOOTER } from "@/lib/algorithms";

export function AdultPostArrestPanel({ onGoToCauses }: { onGoToCauses: () => void }) {
  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-bold tracking-tight text-brand-white">
        Adult Post-Cardiac-Arrest Care
      </h2>

      <StepCard title="Step 1 — Optimize ventilation and oxygenation">
        <ul className="list-disc space-y-1 pl-5">
          <li>SpO₂ 92–98%.</li>
          <li>PaCO₂ 35–45 mmHg (avoid hyperventilation).</li>
          <li>Advanced airway and waveform capnography as appropriate.</li>
        </ul>
      </StepCard>

      <StepCard title="Step 2 — Treat hypotension">
        <ul className="list-disc space-y-1 pl-5">
          <li>Mean arterial pressure ≥ 65 mmHg.</li>
          <li>IV/IO bolus 1–2 L isotonic crystalloid.</li>
          <li>Vasopressor: epinephrine, dopamine, or norepinephrine infusion.</li>
        </ul>
      </StepCard>

      <StepCard title="Step 3 — 12-lead ECG">
        <p>STEMI present? → activate cath lab and treat per local protocol.</p>
      </StepCard>

      <StepCard title="Step 4 — Targeted Temperature Management (TTM)">
        <ul className="list-disc space-y-1 pl-5">
          <li>For comatose patients post-ROSC.</li>
          <li>Maintain constant temperature 32–36°C for at least 24 hours.</li>
        </ul>
      </StepCard>

      <StepCard title="Step 5 — Continued critical care">
        <p>
          Glucose control, sedation, neuro assessment, prognostication delayed
          ≥ 72 hours.
        </p>
      </StepCard>

      <StepCard title="Step 6 — Identify and treat reversible causes">
        <QuickLinkButton label="Open Causes" onClick={onGoToCauses} />
      </StepCard>

      <PanelFooter extra={POST_ARREST_FOOTER} />
    </div>
  );
}
