// PWA install helpers + storage usage. No service worker.

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const W = (typeof window !== "undefined" ? window : null) as
  | (Window & { __mednurseInstallEvent?: BeforeInstallPromptEvent | null })
  | null;

export function captureInstallPrompt() {
  if (!W) return;
  W.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    W.__mednurseInstallEvent = e as BeforeInstallPromptEvent;
    window.dispatchEvent(new CustomEvent("mednurse:install-available"));
  });
  W.addEventListener("appinstalled", () => {
    W.__mednurseInstallEvent = null;
    window.dispatchEvent(new CustomEvent("mednurse:install-installed"));
  });
}

export function hasInstallPrompt(): boolean {
  return !!W?.__mednurseInstallEvent;
}

export async function triggerInstall(): Promise<"accepted" | "dismissed" | "unavailable"> {
  if (!W?.__mednurseInstallEvent) return "unavailable";
  const ev = W.__mednurseInstallEvent;
  try {
    await ev.prompt();
    const choice = await ev.userChoice;
    W.__mednurseInstallEvent = null;
    return choice.outcome;
  } catch {
    return "dismissed";
  }
}

export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  const mql = window.matchMedia?.("(display-mode: standalone)");
  if (mql?.matches) return true;
  const navAny = navigator as Navigator & { standalone?: boolean };
  return !!navAny.standalone;
}

export function isIos(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window);
}

// Returns approximate localStorage bytes used by mednurse.* keys.
export function getMednurseStorageBytes(): number {
  if (typeof window === "undefined") return 0;
  try {
    let total = 0;
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (!k || !k.startsWith("mednurse.")) continue;
      const v = window.localStorage.getItem(k) ?? "";
      total += k.length + v.length;
    }
    return total;
  } catch {
    return 0;
  }
}

export function formatBytes(b: number): string {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(2)} MB`;
}
