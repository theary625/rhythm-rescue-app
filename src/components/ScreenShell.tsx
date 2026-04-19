import { Link } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import type { ReactNode } from "react";
import { MedNurseLogo } from "@/brand/MedNurseLogo";
import { cn } from "@/lib/utils";

interface Props {
  children: ReactNode;
  surface?: "navy" | "softblue";
  showTopBar?: boolean;
  className?: string;
}

export function ScreenShell({
  children,
  surface = "navy",
  showTopBar = true,
  className,
}: Props) {
  const isSoft = surface === "softblue";
  return (
    <div
      className={cn(
        "min-h-screen w-full",
        isSoft ? "bg-brand-softblue text-brand-navy" : "bg-brand-navy text-brand-white",
      )}
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {showTopBar && (
        <header className="flex h-16 items-center justify-between px-5">
          <Link to="/" aria-label="MedNurse home" className="flex items-center">
            <MedNurseLogo
              variant="full"
              tone={isSoft ? "dark" : "light"}
              className="h-10 w-auto"
            />
          </Link>
          <Link
            to="/settings"
            aria-label="Settings"
            className={cn(
              "inline-flex h-12 w-12 items-center justify-center rounded-full transition-colors",
              isSoft ? "hover:bg-brand-navy/10" : "hover:bg-white/10",
            )}
          >
            <Settings className="h-5 w-5" />
          </Link>
        </header>
      )}
      <main className={cn("px-5", className)}>{children}</main>
    </div>
  );
}
