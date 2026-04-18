import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/Button";
import { useApp } from "@/lib/app-context";
import { formatElapsed } from "@/components/CodeTimer";

export const Route = createFileRoute("/debrief")({
  head: () => ({
    meta: [
      { title: "Code summary — MedNurse CodeAssist" },
      { name: "description", content: "Code session summary." },
    ],
  }),
  component: DebriefScreen,
});

function DebriefScreen() {
  const navigate = useNavigate();
  const { code } = useApp();

  return (
    <div
      className="min-h-screen bg-brand-softblue text-brand-navy"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <main className="mx-auto flex min-h-screen max-w-md flex-col px-5 py-10">
        <h1 className="text-4xl font-bold tracking-tight">Code summary.</h1>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="space-y-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-brand-navy/60">
                Elapsed time
              </div>
              <div className="mt-1 font-mono font-semibold tabular-nums text-5xl text-brand-navy">
                {formatElapsed(code.finalElapsedMs)}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-brand-navy/60">
                Compressor switches
              </div>
              <div className="mt-1 font-mono font-semibold tabular-nums text-4xl text-brand-navy">
                {code.compressorSwitchCount}
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-sm text-brand-navy/70">
          Full debrief — cycles, rhythm checks, and exportable log — coming next.
        </p>

        <div className="mt-auto pt-10">
          <Button variant="primary" size="lg" fullWidth onClick={() => navigate({ to: "/" })}>
            Return home.
          </Button>
          <p className="mt-4 text-center text-[10px] text-brand-navy/50">
            Cognitive aid. Not a replacement for clinical judgment.
          </p>
        </div>
      </main>
    </div>
  );
}
