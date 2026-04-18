import { Link } from "@tanstack/react-router";
import { ALGORITHMS } from "@/lib/acls-data";
import { ChevronRight, Heart } from "lucide-react";
import { useMode } from "@/lib/mode";

export function AlgorithmGrid() {
  const { mode } = useMode();
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {ALGORITHMS.map((a) => (
        <Link
          key={a.slug}
          to="/algorithms/$slug"
          params={{ slug: a.slug }}
          className="group flex flex-col rounded-2xl border border-border bg-surface p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elevated"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <Heart className="h-5 w-5" strokeWidth={2.4} />
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
          </div>
          <h3 className="mt-4 text-lg font-bold leading-tight">{a.title}</h3>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {a.short}
          </p>
          {mode === "study" && (
            <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{a.summary}</p>
          )}
        </Link>
      ))}
    </div>
  );
}
