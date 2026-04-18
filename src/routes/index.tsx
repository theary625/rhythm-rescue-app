import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ScreenShell } from "@/components/ScreenShell";
import { SegmentedControl } from "@/components/SegmentedControl";
import { Button } from "@/components/Button";
import { InstallBanner } from "@/components/InstallBanner";
import { IosInstallTooltip } from "@/components/IosInstallTooltip";
import { useApp, type PatientMode, type RescuerCount } from "@/lib/app-context";
import { speak, VOICE_LINES } from "@/lib/voice";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MedNurse CodeAssist — Built for the moments that matter most" },
      {
        name: "description",
        content:
          "Code-blue cognitive aid for nurses. AHA-aligned CPR metronome and ACLS workflow support.",
      },
      { property: "og:title", content: "MedNurse CodeAssist" },
      {
        property: "og:description",
        content: "Code-blue cognitive aid. AHA-aligned. Built for nurses.",
      },
    ],
  }),
  component: HomeScreen,
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

function HomeScreen() {
  const { patientMode, setPatientMode, rescuers, setRescuers, startCode } = useApp();
  const navigate = useNavigate();

  const handleStart = () => {
    startCode();
    speak(VOICE_LINES.codeStart);
    navigate({ to: "/code" });
  };

  return (
    <ScreenShell>
      <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-md flex-col">
        <section className="flex flex-1 flex-col justify-center py-10">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-brand-white sm:text-5xl">
            Built for the moments that matter most.
          </h1>
          <p className="mt-4 text-base text-brand-white/70">
            Code-blue cognitive aid. AHA-aligned. Built for nurses.
          </p>

          <div className="mt-10 space-y-6">
            <SegmentedControl
              label="Patient"
              options={PATIENT_OPTIONS}
              value={patientMode}
              onChange={setPatientMode}
            />
            <SegmentedControl
              label="Rescuers"
              options={RESCUER_OPTIONS}
              value={rescuers}
              onChange={setRescuers}
            />
          </div>

          <div className="mt-10 space-y-4">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleStart}
            >
              Start Code
            </Button>
            <div className="text-center">
              <Link
                to="/reference"
                className="inline-flex min-h-12 items-center justify-center text-sm font-semibold text-brand-softblue hover:text-brand-white"
              >
                Quick reference →
              </Link>
            </div>
          </div>
        </section>

        <footer className="pb-8 pt-4 text-center text-xs text-brand-white/50">
          Cognitive aid. Not a replacement for clinical judgment.
        </footer>
      </div>
      <InstallBanner />
      <IosInstallTooltip />
    </ScreenShell>
  );
}
