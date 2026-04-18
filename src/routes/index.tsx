import { createFileRoute, Link } from "@tanstack/react-router";
import { MetronomePanel } from "@/components/metronome-panel";
import { TimersPanel } from "@/components/timers-panel";
import { ActionsPanel } from "@/components/actions-panel";
import { AlgorithmGrid } from "@/components/algorithm-grid";
import { useMode } from "@/lib/mode";
import { ArrowRight, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [{ title: "Console — CodeBlue ACLS Companion" }],
  }),
});

function Index() {
  const { mode } = useMode();
  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <section className="rounded-3xl bg-gradient-hero p-6 text-primary-foreground shadow-elevated sm:p-10">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-primary-foreground/85">
          <ShieldCheck className="h-3.5 w-3.5" /> AHA-aligned reference · Training use
        </div>
        <h1 className="mt-3 text-balance text-3xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
          Run a code with confidence.
        </h1>
        <p className="mt-3 max-w-2xl text-balance text-base text-primary-foreground/85 sm:text-lg">
          A CPR metronome, 2-minute cycle timer, drug reminders and the full ACLS algorithm set —
          one tap away.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/algorithms"
            className="inline-flex items-center gap-2 rounded-xl bg-background px-5 py-3 text-sm font-bold text-foreground shadow-card transition hover:-translate-y-0.5"
          >
            Browse algorithms <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#console"
            className="inline-flex items-center gap-2 rounded-xl border border-primary-foreground/30 bg-primary-foreground/10 px-5 py-3 text-sm font-bold text-primary-foreground backdrop-blur transition hover:bg-primary-foreground/20"
          >
            Start the metronome
          </a>
        </div>
      </section>

      <section id="console" className="mt-8 grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-4">
          <MetronomePanel />
        </div>
        <div className="space-y-4">
          <TimersPanel />
          <ActionsPanel />
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              {mode === "code" ? "Quick reference" : "Study mode"}
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight">ACLS Algorithms</h2>
          </div>
          <Link
            to="/algorithms"
            className="hidden items-center gap-1 text-sm font-semibold text-primary hover:underline sm:inline-flex"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <AlgorithmGrid />
      </section>

      <Disclaimer />
    </main>
  );
}

function Disclaimer() {
  return (
    <footer className="mt-12 rounded-2xl border border-border bg-muted/40 p-5 text-xs leading-relaxed text-muted-foreground">
      <strong className="text-foreground">For training & reference only.</strong> This app is not a
      medical device and does not replace clinical judgment, current AHA guidelines, or your local
      protocols. Always confirm doses and decisions with your team and pharmacy.
    </footer>
  );
}
