import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { ScreenShell } from "@/components/ScreenShell";
import { Toggle } from "@/components/Toggle";
import { SegmentedControl } from "@/components/SegmentedControl";
import { useApp, type PatientMode } from "@/lib/app-context";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — MedNurse CodeAssist" },
      { name: "description", content: "Your preferences. Saved on this device." },
    ],
  }),
  component: SettingsScreen,
});

const PATIENT_OPTIONS: { value: PatientMode; label: string }[] = [
  { value: "adult", label: "Adult" },
  { value: "pediatric", label: "Pediatric" },
  { value: "infant", label: "Infant" },
];

function SettingsScreen() {
  const {
    sound,
    setSound,
    haptics,
    setHaptics,
    patientMode,
    setPatientMode,
    resetDisclaimer,
  } = useApp();

  return (
    <div
      className="min-h-screen bg-brand-softblue text-brand-navy"
      style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <header className="flex h-14 items-center px-2">
        <Link
          to="/"
          aria-label="Back"
          className="inline-flex h-12 w-12 items-center justify-center rounded-full hover:bg-brand-navy/10"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-bold tracking-tight">Settings</h1>
      </header>

      <main className="mx-auto max-w-md space-y-4 px-5 pb-10">
        <p className="px-1 text-sm text-brand-navy/70">
          Your preferences. Saved on this device. Nothing leaves your phone.
        </p>

        <Card>
          <Toggle
            label="Sound"
            description="Metronome clicks and audible alerts."
            checked={sound}
            onChange={setSound}
          />
          <Divider />
          <Toggle
            label="Haptics"
            description="Vibration on beat and alert events."
            checked={haptics}
            onChange={setHaptics}
          />
        </Card>

        <Card>
          <div className="text-sm font-semibold uppercase tracking-wider text-brand-navy/60">
            Default patient mode
          </div>
          <div className="mt-3">
            <SegmentedControlNavy
              options={PATIENT_OPTIONS}
              value={patientMode}
              onChange={setPatientMode}
            />
          </div>
        </Card>

        <Card>
          <button
            type="button"
            onClick={resetDisclaimer}
            className="w-full min-h-12 text-left text-base font-semibold text-brand-red"
          >
            Show disclaimer on next launch
          </button>
        </Card>

        <Card>
          <div className="space-y-2 text-sm leading-relaxed text-brand-navy/80">
            <div className="text-base font-bold text-brand-navy">About</div>
            <p>MedNurse CodeAssist. Version 0.1.0.</p>
            <p>AHA guideline reference: 2020 BLS/ACLS/PALS with 2025 focused updates.</p>
            <p className="font-semibold text-brand-navy">Built for nurses.</p>
          </div>
        </Card>
      </main>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">{children}</div>
  );
}

function Divider() {
  return <div className="my-1 h-px bg-brand-navy/10" />;
}

// Light-surface variant of the segmented control
function SegmentedControlNavy<T extends string>({
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
