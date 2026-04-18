import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  children: ReactNode;
  className?: string;
  label?: string;
}

export function BigNumber({ children, className, label }: Props) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          "font-mono font-semibold tabular-nums text-7xl leading-none text-brand-white",
          className,
        )}
      >
        {children}
      </div>
      {label && (
        <div className="mt-2 text-xs font-semibold uppercase tracking-widest text-brand-white/60">
          {label}
        </div>
      )}
    </div>
  );
}
