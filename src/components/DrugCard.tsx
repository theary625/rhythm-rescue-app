import { Button } from "./Button";
import type { DrugRef } from "@/lib/ahaConstants";

interface Props {
  drug: DrugRef;
  weightKg: number | null;
  /** When undefined, the Log dose button is hidden (Reference Mode). */
  onLogDose?: (entry: { name: string; doseDisplay: string }) => void;
}

function calcMg(perKgMg: number, weight: number, max?: number) {
  const raw = perKgMg * weight;
  const capped = max !== undefined ? Math.min(raw, max) : raw;
  return { raw, capped, isCapped: max !== undefined && raw > max };
}

function formatMg(mg: number) {
  if (mg >= 10) return `${mg.toFixed(0)} mg`;
  if (mg >= 1) return `${mg.toFixed(1)} mg`;
  return `${mg.toFixed(2)} mg`;
}

export function DrugCard({ drug, weightKg, onLogDose }: Props) {
  const isPed = !!drug.perKgMg;
  let calculated: ReturnType<typeof calcMg> | null = null;
  if (isPed && weightKg) {
    calculated = calcMg(drug.perKgMg!, weightKg, drug.maxSingleDoseMg);
  }

  return (
    <div className="rounded-2xl bg-brand-accent/15 p-4">
      <div className="text-lg font-bold tracking-tight text-brand-white">{drug.name}</div>
      <div className="mt-0.5 text-xs font-semibold text-brand-softblue">
        {drug.indication}
      </div>

      {isPed && (
        <div className="mt-3 text-sm text-brand-white/80">
          <span className="font-mono tabular-nums">{drug.formula}</span>
        </div>
      )}

      {calculated ? (
        <div className="mt-2 font-mono text-2xl font-semibold tabular-nums text-brand-white">
          {formatMg(calculated.capped)}
          {drug.name === "Epinephrine" && (
            <span className="ml-2 text-sm text-brand-white/70">
              ({(weightKg! * 0.1).toFixed(2)} mL of 1:10,000)
            </span>
          )}
        </div>
      ) : (
        <div className="mt-2 font-mono text-base font-semibold tabular-nums text-brand-white">
          {drug.dose}
        </div>
      )}

      {calculated?.isCapped && (
        <div className="mt-1 text-xs font-semibold text-brand-red">
          Capped at adult max.
        </div>
      )}

      <div className="mt-2 text-xs text-brand-white/70">
        <span className="font-bold">Interval: </span>
        {drug.interval}
      </div>
      {drug.minSingleDose && (
        <div className="mt-1 text-xs font-semibold text-brand-red">
          {drug.minSingleDose}
        </div>
      )}
      {drug.maxSingleDose && (
        <div className="mt-1 text-xs text-brand-white/70">
          <span className="font-bold">Max single dose: </span>
          {drug.maxSingleDose}
        </div>
      )}
      {drug.max && (
        <div className="mt-1 text-xs text-brand-white/70">
          <span className="font-bold">Max: </span>
          {drug.max}
        </div>
      )}
      {drug.notes && (
        <div className="mt-1 text-xs text-brand-white/60">{drug.notes}</div>
      )}

      {onLogDose && (
        <Button
          variant="secondary"
          size="md"
          className="mt-3"
          onClick={() =>
            onLogDose({
              name: drug.name,
              doseDisplay: calculated ? formatMg(calculated.capped) : drug.dose,
            })
          }
        >
          Log dose given
        </Button>
      )}
    </div>
  );
}
