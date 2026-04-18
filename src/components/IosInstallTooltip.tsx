import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { hasInstallPrompt, isIos, isStandalone } from "@/lib/pwa";

const SHOWN_KEY = "mednurse.iosTooltipShown";

export function IosInstallTooltip() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isIos() || isStandalone() || hasInstallPrompt()) return;
    try {
      if (window.localStorage.getItem(SHOWN_KEY)) return;
    } catch {
      return;
    }
    setShow(true);
  }, []);

  if (!show) return null;

  const dismiss = () => {
    try {
      window.localStorage.setItem(SHOWN_KEY, "1");
    } catch {
      /* ignore */
    }
    setShow(false);
  };

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md p-4"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)" }}
    >
      <div className="relative rounded-2xl bg-brand-softblue p-4 pr-12 text-sm font-semibold text-brand-navy shadow-lg">
        Install on your iPhone: Share → Add to Home Screen.
        <button
          type="button"
          aria-label="Dismiss"
          onClick={dismiss}
          className="absolute right-2 top-2 inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-brand-navy/10"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
