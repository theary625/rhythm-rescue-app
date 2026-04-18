import { REVERSIBLE_CAUSES } from "@/lib/ahaConstants";
import { cn } from "@/lib/utils";

interface Props {
  considered: string[];
}

export function CausesGrid({ considered }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {REVERSIBLE_CAUSES.map((c) => {
        const done = considered.includes(c.label);
        return (
          <div
            key={c.label}
            className={cn(
              "flex items-start gap-2 rounded-xl p-2",
              done ? "bg-brand-red/10" : "bg-brand-navy/5 opacity-40",
            )}
          >
            <span
              className={cn(
                "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white",
                c.code === "H" ? "bg-brand-accent" : "bg-brand-red",
              )}
            >
              {c.code}
            </span>
            <span className="flex-1 text-xs font-semibold leading-snug text-brand-navy">
              {c.label}
              {done && (
                <svg
                  viewBox="0 0 16 16"
                  className="ml-1 inline h-3 w-3 text-brand-red"
                  fill="none"
                >
                  <path
                    d="M3 8l3 3 7-7"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}
