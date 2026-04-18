import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { Toggle } from "@/components/Toggle";
import { Slider } from "@/components/Slider";
import { ConfirmModal } from "@/components/ConfirmModal";
import { VoicePicker } from "@/components/VoicePicker";
import { isListenerAvailable } from "@/lib/listener";
import {
  formatBytes,
  getMednurseStorageBytes,
  hasInstallPrompt,
  isStandalone,
  triggerInstall,
} from "@/lib/pwa";
import {
  useApp,
  type ClickPitch,
  type PatientMode,
  type RescuerCount,
} from "@/lib/app-context";

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
const RESCUER_OPTIONS: { value: RescuerCount; label: string }[] = [
  { value: "single", label: "Single" },
  { value: "two", label: "Two" },
];
const BPM_OPTIONS = [
  { value: "100", label: "100" },
  { value: "110", label: "110" },
  { value: "120", label: "120" },
];
const PITCH_OPTIONS: { value: ClickPitch; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "mid", label: "Mid" },
  { value: "high", label: "High" },
];

function SettingsScreen() {
  const {
    sound,
    setSound,
    haptics,
    setHaptics,
    patientMode,
    setPatientMode,
    rescuers,
    setRescuers,
    defaultBpm,
    setDefaultBpm,
    clickPitch,
    setClickPitch,
    clickVolume,
    setClickVolume,
    colorBlindMode,
    setColorBlindMode,
    voicePromptsEnabled,
    setVoicePromptsEnabled,
    voiceVolume,
    setVoiceVolume,
    preferredVoiceURI,
    setPreferredVoiceURI,
    handsFreeEnabled,
    setHandsFreeEnabled,
    compactMode,
    setCompactMode,
    resetDisclaimer,
    resetOnboarding,
    resetPreferences,
    history,
    clearHistory,
  } = useApp();

  const handsFreeAvailable = isListenerAvailable();
  const [installAvailable, setInstallAvailable] = useState(false);
  const [storageBytes, setStorageBytes] = useState(0);

  useEffect(() => {
    setInstallAvailable(hasInstallPrompt() && !isStandalone());
    setStorageBytes(getMednurseStorageBytes());
    const onAvail = () => setInstallAvailable(!isStandalone());
    const onInstalled = () => setInstallAvailable(false);
    window.addEventListener("mednurse:install-available", onAvail);
    window.addEventListener("mednurse:install-installed", onInstalled);
    return () => {
      window.removeEventListener("mednurse:install-available", onAvail);
      window.removeEventListener("mednurse:install-installed", onInstalled);
    };
  }, []);

  const handleInstall = async () => {
    const r = await triggerInstall();
    if (r === "accepted") setInstallAvailable(false);
    if (r === "unavailable") toast("Install unavailable on this browser.");
  };

  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div
      className="min-h-screen bg-brand-softblue text-brand-navy"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
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

      <main className="mx-auto max-w-md space-y-5 px-5 pb-10">
        <p className="px-1 text-sm text-brand-navy/70">
          Your preferences. Saved on this device. Nothing leaves your phone.
        </p>

        <Section title="Defaults">
          <Card>
            <Label>Default patient mode</Label>
            <NavySegmented
              options={PATIENT_OPTIONS}
              value={patientMode}
              onChange={setPatientMode}
            />
          </Card>
          <Card>
            <Label>Default rescuers</Label>
            <NavySegmented options={RESCUER_OPTIONS} value={rescuers} onChange={setRescuers} />
          </Card>
          <Card>
            <Label>Default BPM</Label>
            <NavySegmented
              options={BPM_OPTIONS}
              value={String(defaultBpm)}
              onChange={(v) => setDefaultBpm(parseInt(v, 10))}
            />
          </Card>
        </Section>

        <Section title="Sound & feel">
          <Card>
            <Toggle
              label="Sound"
              description="Metronome clicks and audible alerts."
              checked={sound}
              onChange={setSound}
            />
          </Card>
          <Card>
            <Label>Click pitch</Label>
            <NavySegmented options={PITCH_OPTIONS} value={clickPitch} onChange={setClickPitch} />
          </Card>
          <Card>
            <Slider
              label="Click volume"
              value={clickVolume}
              min={0}
              max={100}
              onChange={setClickVolume}
            />
          </Card>
          <Card>
            <Toggle
              label="Haptics"
              description="Vibration on beat and alert events."
              checked={haptics}
              onChange={setHaptics}
            />
          </Card>
        </Section>

        <Section title="Display">
          <Card>
            <Toggle
              label="Color-blind mode"
              description="Higher-contrast cues for code-active states. Adds dotted borders and pulse markers."
              checked={colorBlindMode}
              onChange={setColorBlindMode}
            />
          </Card>
          <Card>
            <Label>Keep screen on during a code</Label>
            <p className="text-sm text-brand-navy/70">
              Required for safe use during a code.
            </p>
          </Card>
        </Section>

        <Section title="History">
          <Card className="p-0">
            <Link
              to="/history"
              className="flex min-h-12 w-full items-center justify-between p-5 text-left hover:bg-brand-navy/5"
            >
              <span className="text-base font-semibold text-brand-navy">View history</span>
              <span className="text-sm text-brand-navy/60">{history.length} / 5</span>
            </Link>
          </Card>
          <Card>
            <button
              type="button"
              onClick={() => setConfirmClear(true)}
              disabled={history.length === 0}
              className="inline-flex h-12 w-full items-center justify-center rounded-xl border-2 border-brand-red text-sm font-bold text-brand-red hover:bg-brand-red/10 disabled:opacity-40"
            >
              Clear all history
            </button>
          </Card>
        </Section>

        <Section title="About & feedback">
          <Card className="space-y-2 p-0">
            <button
              type="button"
              onClick={() => {
                resetOnboarding();
                toast("Onboarding will show on next launch.");
              }}
              className="block w-full p-5 text-left text-base font-semibold text-brand-navy hover:bg-brand-navy/5"
            >
              Show onboarding on next launch
            </button>
            <div className="h-px bg-brand-navy/10" />
            <button
              type="button"
              onClick={() => {
                resetDisclaimer();
                toast("Disclaimer will show on next launch.");
              }}
              className="block w-full p-5 text-left text-base font-semibold text-brand-navy hover:bg-brand-navy/5"
            >
              Show disclaimer on next launch
            </button>
            <div className="h-px bg-brand-navy/10" />
            <a
              href="mailto:feedback@mednurse.app?subject=CodeAssist%20feedback"
              className="block w-full p-5 text-left text-base font-semibold text-brand-navy hover:bg-brand-navy/5"
            >
              Send feedback
            </a>
          </Card>
          <Card>
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="inline-flex h-12 w-full items-center justify-center rounded-xl border-2 border-brand-red text-sm font-bold text-brand-red hover:bg-brand-red/10"
            >
              Reset all preferences
            </button>
          </Card>
          <Card>
            <div className="space-y-1 text-sm leading-relaxed text-brand-navy/80">
              <div className="text-base font-bold text-brand-navy">MedNurse CodeAssist</div>
              <p>Version 0.4.0</p>
              <p>AHA reference: 2020 BLS/ACLS/PALS with 2025 focused updates</p>
              <p className="font-semibold text-brand-navy">Built for nurses.</p>
            </div>
          </Card>
        </Section>
      </main>

      <ConfirmModal
        open={confirmClear}
        headline="Clear all history?"
        body="This cannot be undone."
        confirmLabel="Clear all"
        cancelLabel="Keep"
        onConfirm={() => {
          clearHistory();
          setConfirmClear(false);
          toast("History cleared.");
        }}
        onCancel={() => setConfirmClear(false)}
      />
      <ConfirmModal
        open={confirmReset}
        headline="Reset all preferences?"
        body="Your history will be kept."
        confirmLabel="Reset"
        cancelLabel="Cancel"
        onConfirm={() => {
          resetPreferences();
          setConfirmReset(false);
          toast("Preferences reset.");
        }}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="px-1 pb-2 text-xs font-bold uppercase tracking-widest text-brand-navy/60">
        {title}
      </div>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl bg-white shadow-sm ${className || "p-5"}`}>{children}</div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 text-xs font-bold uppercase tracking-widest text-brand-navy/60">
      {children}
    </div>
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
