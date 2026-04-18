import { useApp } from "@/lib/app-context";
import { Button } from "./Button";

export function DisclaimerModal() {
  const { disclaimerAccepted, acceptDisclaimer, onboardingComplete } = useApp();

  if (disclaimerAccepted) return null;
  if (!onboardingComplete) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="disclaimer-title"
      className="fixed inset-0 z-50 flex flex-col bg-brand-navy text-brand-white"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="flex flex-1 flex-col justify-between px-6 py-10">
        <div className="mt-12">
          <h1
            id="disclaimer-title"
            className="text-4xl font-bold tracking-tight"
          >
            Read this first.
          </h1>
          <p className="mt-6 text-base leading-relaxed text-brand-white/80">
            MedNurse CodeAssist is a cognitive aid for trained providers. It does
            not replace AHA certification, clinical judgment, or your code team.
            Use it alongside — not instead of — your training.
          </p>
        </div>
        <Button variant="primary" size="lg" fullWidth onClick={acceptDisclaimer}>
          I understand. Continue.
        </Button>
      </div>
    </div>
  );
}
