import { Link, useLocation } from "@tanstack/react-router";
import { Activity, Heart, Stethoscope, BookOpen, Zap } from "lucide-react";
import { useMode } from "@/lib/mode";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Console", icon: Activity },
  { to: "/algorithms", label: "Algorithms", icon: Heart },
  { to: "/reference", label: "Reference", icon: BookOpen },
];

export function AppHeader() {
  const { mode, setMode } = useMode();
  const location = useLocation();
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-emergency text-destructive-foreground shadow-card">
            <Zap className="h-5 w-5" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <div className="text-[15px] font-bold tracking-tight">CodeBlue</div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              ACLS Companion
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => {
            const Icon = n.icon;
            const active = n.to === "/" ? location.pathname === "/" : location.pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden items-center gap-1 rounded-full border border-border bg-surface p-1 text-xs font-semibold sm:flex">
            <button
              onClick={() => setMode("code")}
              className={cn(
                "rounded-full px-3 py-1.5 transition-all",
                mode === "code"
                  ? "bg-destructive text-destructive-foreground shadow-card"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Stethoscope className="mr-1 inline h-3.5 w-3.5" />
              In-Code
            </button>
            <button
              onClick={() => setMode("study")}
              className={cn(
                "rounded-full px-3 py-1.5 transition-all",
                mode === "study"
                  ? "bg-primary text-primary-foreground shadow-card"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <BookOpen className="mr-1 inline h-3.5 w-3.5" />
              Study
            </button>
          </div>
        </div>
      </div>

      <nav className="flex border-t border-border md:hidden">
        {NAV.map((n) => {
          const Icon = n.icon;
          const active = n.to === "/" ? location.pathname === "/" : location.pathname.startsWith(n.to);
          return (
            <Link
              key={n.to}
              to={n.to}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-semibold",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className="h-4 w-4" /> {n.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
