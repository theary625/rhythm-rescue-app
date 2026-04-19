import { useApp, type PatientMode } from "@/lib/app-context";
import { DEFIB_ENERGIES } from "@/lib/ahaConstants";
import { WalkthroughBar } from "./algorithms/SpeakControls";

export function DefibEnergyCard({ mode }: { mode: PatientMode }) {
  if (mode === "adult") {
    const e = DEFIB_ENERGIES.adult;
    return (
      <div className="space-y-2 text-sm">
        <Row label="Adult biphasic" value={e.biphasic} />
        <Row label="Adult monophasic" value={e.monophasic} />
        <Row label="Subsequent shocks" value={e.subsequent} />
      </div>
    );
  }
  const e = DEFIB_ENERGIES.pediatric;
  return (
    <div className="space-y-2 text-sm">
      <Row label="Pediatric first shock" value={e.first} />
      <Row label="Pediatric second shock" value={e.second} />
      <Row label="Subsequent shocks" value={e.subsequent} />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-widest text-brand-white/60">
        {label}
      </div>
      <div className="text-brand-white">{value}</div>
    </div>
  );
}

export function ShockableBranch({
  mode,
  onLogEpi,
  onGoToDrugs,
  onGoToCauses,
  isReferenceMode = false,
}: {
  mode: PatientMode;
  onLogEpi: () => void;
  onGoToDrugs: () => void;
  onGoToCauses: () => void;
  isReferenceMode?: boolean;
}) {
  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-bold tracking-tight">VF / pulseless VT</h2>

      <StepCard title="Step 1 — Defibrillate">
        <DefibEnergyCard mode={mode} />
        <p className="mt-3 text-xs text-brand-white/70">
          Clear. Charge. Shock. Resume compressions immediately.
        </p>
      </StepCard>

      <StepCard title="Step 2 — Resume CPR for 2 minutes">
        <p className="text-sm text-brand-white/80">
          High-quality compressions. Minimize interruptions.
        </p>
      </StepCard>

      <StepCard title="Step 3 — Epinephrine 1 mg IV/IO">
        {!isReferenceMode && (
          <button
            type="button"
            onClick={onLogEpi}
            className="mt-2 inline-flex h-12 items-center justify-center rounded-2xl bg-brand-red px-5 text-sm font-bold text-brand-white hover:brightness-110"
          >
            Log dose given
          </button>
        )}
      </StepCard>

      <StepCard title="Step 4 — Consider amiodarone or lidocaine">
        <button
          type="button"
          onClick={onGoToDrugs}
          className="mt-2 inline-flex h-12 items-center justify-center rounded-2xl border-2 border-brand-accent px-5 text-sm font-bold text-brand-white hover:bg-brand-accent/20"
        >
          Open Drugs
        </button>
      </StepCard>

      <StepCard title="Step 5 — Identify and treat reversible causes">
        <button
          type="button"
          onClick={onGoToCauses}
          className="mt-2 inline-flex h-12 items-center justify-center rounded-2xl border-2 border-brand-accent px-5 text-sm font-bold text-brand-white hover:bg-brand-accent/20"
        >
          Open Causes
        </button>
      </StepCard>

      <p className="pt-2 text-center text-[10px] text-brand-white/50">
        AHA ACLS reference. Cognitive aid only — follow your code team and orders.
      </p>
    </div>
  );
}

export function NonShockableBranch({
  onLogEpi,
  onGoToCauses,
  isReferenceMode = false,
}: {
  onLogEpi: () => void;
  onGoToCauses: () => void;
  isReferenceMode?: boolean;
}) {
  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-bold tracking-tight">Asystole / PEA</h2>

      <StepCard title="Step 1 — Continue high-quality CPR">
        <p className="text-sm text-brand-white/80">
          Minimize interruptions. Full chest recoil.
        </p>
      </StepCard>

      <StepCard title="Step 2 — Epinephrine 1 mg IV/IO ASAP">
        {!isReferenceMode && (
          <button
            type="button"
            onClick={onLogEpi}
            className="mt-2 inline-flex h-12 items-center justify-center rounded-2xl bg-brand-red px-5 text-sm font-bold text-brand-white hover:brightness-110"
          >
            Log dose given
          </button>
        )}
      </StepCard>

      <StepCard title="Step 3 — Identify and treat reversible causes">
        <button
          type="button"
          onClick={onGoToCauses}
          className="mt-2 inline-flex h-12 items-center justify-center rounded-2xl border-2 border-brand-accent px-5 text-sm font-bold text-brand-white hover:bg-brand-accent/20"
        >
          Open Causes
        </button>
      </StepCard>

      <StepCard title="Step 4 — Reassess rhythm at next 2-minute check">
        <p className="text-sm text-brand-white/80">
          Pulse check ≤ 10 seconds. Resume immediately.
        </p>
      </StepCard>

      <p className="pt-2 text-center text-[10px] text-brand-white/50">
        AHA ACLS reference. Cognitive aid only — follow your code team and orders.
      </p>
    </div>
  );
}

export function AlgorithmTab({
  onGoToDrugs,
  onGoToCauses,
  isReferenceMode = false,
}: {
  onGoToDrugs: () => void;
  onGoToCauses: () => void;
  isReferenceMode?: boolean;
}) {
  const { code, patientMode, setRhythm, logEpi } = useApp();

  if (!code.currentRhythm) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight">
          What rhythm are you treating?
        </h2>
        <button
          type="button"
          onClick={() => setRhythm("shockable")}
          className="inline-flex h-16 w-full items-center justify-center rounded-2xl bg-brand-red px-5 text-base font-bold text-brand-white hover:brightness-110"
        >
          Shockable (VF / pulseless VT)
        </button>
        <button
          type="button"
          onClick={() => setRhythm("non-shockable")}
          className="inline-flex h-16 w-full items-center justify-center rounded-2xl border-2 border-brand-accent bg-transparent px-5 text-base font-bold text-brand-white hover:bg-brand-accent/20"
        >
          Non-shockable (Asystole / PEA)
        </button>
        <p className="text-center text-xs text-brand-white/60">
          You can change this at the next rhythm check.
        </p>
      </div>
    );
  }

  return code.currentRhythm === "shockable" ? (
    <ShockableBranch
      mode={patientMode}
      onLogEpi={logEpi}
      onGoToDrugs={onGoToDrugs}
      onGoToCauses={onGoToCauses}
      isReferenceMode={isReferenceMode}
    />
  ) : (
    <NonShockableBranch
      onLogEpi={logEpi}
      onGoToCauses={onGoToCauses}
      isReferenceMode={isReferenceMode}
    />
  );
}

function StepCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-brand-accent/15 p-4">
      <div className="text-sm font-bold tracking-tight text-brand-white">{title}</div>
      <div className="mt-2">{children}</div>
    </div>
  );
}
