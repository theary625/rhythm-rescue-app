import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ALGORITHMS, type AlgoStep, type StepKind, type Algorithm } from "@/lib/acls-data";
import { ArrowLeft, Zap, Syringe, Activity, Heart, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useMode } from "@/lib/mode";

export const Route = createFileRoute("/algorithms/$slug")({
  loader: ({ params }) => {
    const algo = ALGORITHMS.find((a) => a.slug === params.slug);
    if (!algo) throw notFound();
    return { algo };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.algo.title} — ACLS · CodeBlue` },
          { name: "description", content: loaderData.algo.summary },
          { property: "og:title", content: `${loaderData.algo.title} — ACLS Algorithm` },
          { property: "og:description", content: loaderData.algo.summary },
        ]
      : [],
  }),
  component: AlgorithmDetail,
  notFoundComponent: () => (
    <main className="mx-auto max-w-3xl px-6 py-16 text-center">
      <h1 className="text-2xl font-bold">Algorithm not found</h1>
      <Link to="/algorithms" className="mt-4 inline-block text-primary hover:underline">
        Back to algorithms
      </Link>
    </main>
  ),
  errorComponent: ({ error }) => (
    <main className="mx-auto max-w-3xl px-6 py-16 text-center">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-muted-foreground">{error.message}</p>
    </main>
  ),
});

const ICON: Record<StepKind, React.ComponentType<{ className?: string }>> = {
  action: Activity,
  shock: Zap,
  med: Syringe,
  check: AlertCircle,
  consider: CheckCircle2,
  rosc: Heart,
};

const STYLE: Record<StepKind, string> = {
  action: "border-border bg-surface",
  shock: "border-shock/40 bg-shock/10",
  med: "border-meds/30 bg-meds/5",
  check: "border-warning/40 bg-warning/10",
  consider: "border-primary/30 bg-primary/5",
  rosc: "border-success/40 bg-success/10",
};

const ICON_BG: Record<StepKind, string> = {
  action: "bg-foreground/10 text-foreground",
  shock: "bg-shock/30 text-shock-foreground",
  med: "bg-meds text-meds-foreground",
  check: "bg-warning text-warning-foreground",
  consider: "bg-primary text-primary-foreground",
  rosc: "bg-success text-success-foreground",
};

function AlgorithmDetail() {
  const { algo } = Route.useLoaderData() as { algo: Algorithm };
  const { mode } = useMode();
  const [branchId, setBranchId] = useState(algo.branches[0].id);
  const [done, setDone] = useState<Set<string>>(new Set());
  const branch = algo.branches.find((b) => b.id === branchId) ?? algo.branches[0];

  const toggle = (id: string) => {
    setDone((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
      <Link
        to="/algorithms"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> All algorithms
      </Link>

      <header className="mt-4">
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-destructive">
          {algo.short}
        </div>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">{algo.title}</h1>
        <p className="mt-2 text-muted-foreground">{algo.summary}</p>
      </header>

      {algo.branches.length > 1 && (
        <div className="mt-6 flex flex-wrap gap-2 rounded-xl border border-border bg-surface p-1.5 shadow-card">
          {algo.branches.map((b) => (
            <button
              key={b.id}
              onClick={() => {
                setBranchId(b.id);
                setDone(new Set());
              }}
              className={cn(
                "flex-1 min-w-[140px] rounded-lg px-4 py-2.5 text-sm font-bold transition-all",
                branchId === b.id
                  ? b.shockable
                    ? "bg-destructive text-destructive-foreground shadow-card"
                    : "bg-primary text-primary-foreground shadow-card"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              {b.label}
              {b.rhythms.length > 0 && (
                <div
                  className={cn(
                    "mt-0.5 text-[10px] font-medium uppercase tracking-wider",
                    branchId === b.id ? "opacity-90" : "opacity-70",
                  )}
                >
                  {b.rhythms.join(" · ")}
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      <ol className="mt-6 space-y-2">
        {branch.steps.map((step, i) => (
          <StepRow
            key={`${branch.id}-${i}`}
            step={step}
            n={i + 1}
            done={done.has(`${branch.id}-${i}`)}
            onToggle={() => toggle(`${branch.id}-${i}`)}
            study={mode === "study"}
          />
        ))}
      </ol>

      {algo.notes && algo.notes.length > 0 && (
        <section className="mt-8 rounded-2xl border border-border bg-muted/40 p-5">
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Reversible causes — H's & T's
          </div>
          <ul className="mt-3 space-y-1.5 text-sm">
            {algo.notes.map((n, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-destructive">•</span>
                {n}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-8 rounded-xl border border-border bg-background p-4 text-xs text-muted-foreground">
        Reference only. Confirm with current AHA guidelines and local protocols.
      </div>
    </main>
  );
}

function StepRow({
  step,
  n,
  done,
  onToggle,
  study,
}: {
  step: AlgoStep;
  n: number;
  done: boolean;
  onToggle: () => void;
  study: boolean;
}) {
  const Icon = ICON[step.kind];
  return (
    <li>
      <button
        onClick={onToggle}
        className={cn(
          "group flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-all hover:shadow-card",
          STYLE[step.kind],
          done && "opacity-60",
        )}
      >
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-mono text-sm font-bold",
            done ? "bg-success text-success-foreground" : ICON_BG[step.kind],
          )}
        >
          {done ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-4 w-4" />}
        </span>
        <div className="flex-1 pt-1">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              {String(n).padStart(2, "0")}
            </span>
            <span className={cn("font-bold leading-snug", done && "line-through")}>{step.title}</span>
          </div>
          {step.detail && (study || step.kind === "med" || step.kind === "shock") && (
            <p className="mt-1 text-sm text-muted-foreground">{step.detail}</p>
          )}
        </div>
      </button>
    </li>
  );
}
