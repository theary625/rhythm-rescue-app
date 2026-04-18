import { useEffect, useState } from "react";
import { Button } from "./Button";
import {
  hasInstallPrompt,
  isStandalone,
  triggerInstall,
} from "@/lib/pwa";

const DISMISS_KEY = "mednurse.installDismissedAt";
const SUPPRESS_DAYS = 30;

function isSuppressed(): boolean {
  try {
    const raw = window.localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const at = parseInt(raw, 10);
    if (!Number.isFinite(at)) return false;
    return Date.now() - at < SUPPRESS_DAYS * 86400000;
  } catch {
    return false;
  }
}

export function InstallBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isStandalone() || isSuppressed()) return;

    const update = () => setShow(hasInstallPrompt());
    update();
    const onAvail = () => setShow(true);
    const onInstalled = () => setShow(false);
    window.addEventListener("mednurse:install-available", onAvail);
    window.addEventListener("mednurse:install-installed", onInstalled);
    return () => {
      window.removeEventListener("mednurse:install-available", onAvail);
      window.removeEventListener("mednurse:install-installed", onInstalled);
    };
  }, []);

  if (!show) return null;

  const handleInstall = async () => {
    const result = await triggerInstall();
    if (result !== "unavailable") setShow(false);
  };
  const handleDismiss = () => {
    try {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
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
      <div className="rounded-2xl bg-brand-softblue p-4 text-brand-navy shadow-lg">
        <p className="text-sm font-semibold">
          Install MedNurse CodeAssist on this device.
        </p>
        <div className="mt-3 flex gap-2">
          <Button variant="primary" size="md" fullWidth onClick={handleInstall}>
            Install
          </Button>
          <button
            type="button"
            onClick={handleDismiss}
            className="inline-flex h-12 flex-1 items-center justify-center rounded-2xl text-sm font-bold text-brand-navy hover:bg-brand-navy/10"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
