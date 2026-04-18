import { useState } from "react";
import { OnboardingPanel } from "./OnboardingPanel";
import { Button } from "./Button";
import { Toggle } from "./Toggle";
import { MedNurseLogo } from "@/brand/MedNurseLogo";
import { useApp, type PatientMode, type RescuerCount } from "@/lib/app-context";

const PATIENT_OPTIONS: { value: PatientMode; label: string }[] = [
  { value: "adult", label: "Adult" },
  { value: "pediatric", label: "Pediatric" },
  { value: "infant", label: "Infant" },
];
const RESCUER_OPTIONS: { value: RescuerCount; label: string }[] = [
  { value: "single", label: "Single" },
  { value: "two", label: "Two" },
];

export function Onboarding() {
  const {
    onboardingComplete,
    completeOnboarding,
    patientMode,
    setPatientMode,
    rescuers,
    setRescuers,
    sound,
    setSound,
    haptics,
    setHaptics,
  } = useApp();

  const [step, setStep] = useState(0);

  if (onboardingComplete) return null;

  const next = () => setStep((s) => Math.min(3, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));
  const finish = () => completeOnboarding();

  const TwoActions = ({
    leftLabel,
    leftOnClick,
    rightLabel,
    rightOnClick,
    rightVariant = "primary" as "primary" | "secondary",
  }: {
    leftLabel: string;
    leftOnClick: () => void;
    rightLabel: string;
    rightOnClick: () => void;
    rightVariant?: "primary" | "secondary";
  }) => (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={leftOnClick}
        className="inline-flex h-14 flex-1 items-center justify-center rounded-2xl text-base font-bold text-brand-navy hover:bg-brand-navy/10"
      >
        {leftLabel}
      </button>
      <Button variant={rightVariant} size="md" className="flex-1" onClick={rightOnClick}>
        {rightLabel}
      </Button>
    </div>
  );

  if (step === 0) {
    return (
      <OnboardingPanel
        index={0}
        total={4}
        headline="Built for the moments that matter most."
        actions={
          <TwoActions
            leftLabel="Skip"
            leftOnClick={finish}
            rightLabel="Continue"
            rightOnClick={next}
          />
        }
      >
        <p>
          MedNurse CodeAssist is your code-blue cognitive aid. AHA-aligned. Built for nurses.
        </p>
        <div className="flex justify-center pt-6">
          <MedNurseLogo variant="icon" tone="dark" className="h-24 w-24" />
        </div>
      </OnboardingPanel>
    );
  }

  if (step === 1) {
    return (
      <OnboardingPanel
        index={1}
        total={4}
        headline="A cognitive aid. Not a replacement."
        actions={
          <TwoActions
            leftLabel="Back"
            leftOnClick={back}
            rightLabel="Continue"
            rightOnClick={next}
          />
        }
      >
        <p>Use it during a code to keep your rhythm, your timing, and your team in sync.</p>
        <p>
          It does not replace AHA certification, your code team, or your clinical judgment.
        </p>
        <p className="font-semibold text-brand-navy">You are still the nurse at the bedside.</p>
      </OnboardingPanel>
    );
  }

  if (step === 2) {
    return (
      <OnboardingPanel
        index={2}
        total={4}
        headline="Set your defaults."
        actions={
          <TwoActions
            leftLabel="Back"
            leftOnClick={back}
            rightLabel="Continue"
            rightOnClick={next}
          />
        }
      >
        <p className="text-sm text-brand-navy/70">
          You can change these any time in Settings.
        </p>

        <div className="space-y-5 pt-2">
          <div>
            <div className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-navy/60">
              Default patient
            </div>
            <NavySegmented options={PATIENT_OPTIONS} value={patientMode} onChange={setPatientMode} />
          </div>
          <div>
            <div className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-navy/60">
              Default rescuers
            </div>
            <NavySegmented options={RESCUER_OPTIONS} value={rescuers} onChange={setRescuers} />
          </div>
          <div className="rounded-2xl bg-white p-4">
            <Toggle
              label="Sound"
              description="Metronome clicks and audible alerts."
              checked={sound}
              onChange={setSound}
            />
            <div className="my-1 h-px bg-brand-navy/10" />
            <Toggle
              label="Haptics"
              description="Vibration on beat and alert events."
              checked={haptics}
              onChange={setHaptics}
            />
          </div>
        </div>
      </OnboardingPanel>
    );
  }

  return (
    <OnboardingPanel
      index={3}
      total={4}
      headline="You're ready."
      actions={
        <TwoActions
          leftLabel="Back"
          leftOnClick={back}
          rightLabel="Continue"
          rightOnClick={finish}
          rightVariant="primary"
        />
      }
    >
      <p>Tap Continue to read the disclaimer.</p>
      <p>Then start your first code whenever you need it.</p>
      <div className="mt-4 rounded-2xl bg-white p-4 text-sm text-brand-navy/80">
        When you start a code, the app will ask to keep your screen awake and play a click.
        That's expected.
      </div>
    </OnboardingPanel>
  );
}

function NavySegmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex w-full gap-1 rounded-2xl bg-brand-navy/10 p-1">
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.value)}
            className={
              "flex-1 min-h-12 rounded-xl px-4 text-sm font-semibold transition-all duration-150 " +
              (selected
                ? "bg-brand-navy text-white shadow-sm"
                : "text-brand-navy/70 hover:text-brand-navy")
            }
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
