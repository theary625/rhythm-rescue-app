// Platform capability layer.
//
// Today: pure web APIs (Vibration, Wake Lock, Web Share, Clipboard).
// Future: when this app is wrapped in Capacitor on a local dev machine,
// swap the marked TODO branches to call the native plugins instead.
//
// The web fallbacks below MUST stay — the PWA build keeps using them.
//
// ─── TODO(Capacitor) ─────────────────────────────────────────────────────────
// On a local dev machine after `npx cap add ios|android`:
//
//   import { Capacitor } from '@capacitor/core';
//   import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
//   import { KeepAwake } from '@capacitor/keep-awake';
//   import { Share } from '@capacitor/share';
//
//   export const isNative = Capacitor.isNativePlatform();
//
// Then in each helper, add a leading `if (isNative) { ... await Plugin.x() ... return; }`
// branch BEFORE the existing web fallback. Do not delete the web fallback.
// ─────────────────────────────────────────────────────────────────────────────

export const isNative = false;

let wakeLockSentinel: WakeLockSentinel | null = null;

/** Short haptic pulse per metronome beat. */
export async function beatHaptic(): Promise<void> {
  if (isNative) {
    // @ts-ignore
    await Haptics.impact({ style: ImpactStyle.Light });
    return;
  }
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(20);
    } catch {
      /* ignore */
    }
  }
}

/** Heavier pulse for critical events (compressor switch, epi-due). */
export async function urgentHaptic(): Promise<void> {
  if (isNative) {
    // @ts-ignore
    await Haptics.notification({ type: NotificationType.Warning });
    return;
  }
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(200);
    } catch {
      /* ignore */
    }
  }
}

/** Keep the screen on during an active code. Idempotent. */
export async function keepAwakeOn(): Promise<void> {
  if (isNative) {
    // @ts-ignore
    await KeepAwake.keepAwake();
    return;
  }
  if (typeof navigator === "undefined") return;
  const nav = navigator as Navigator & {
    wakeLock?: { request: (t: "screen") => Promise<WakeLockSentinel> };
  };
  if (!nav.wakeLock?.request) return;
  try {
    wakeLockSentinel = await nav.wakeLock.request("screen");
  } catch {
    /* ignore */
  }
}

/** Release the wake lock. Idempotent. */
export async function keepAwakeOff(): Promise<void> {
  if (isNative) {
    // @ts-ignore
    await KeepAwake.allowSleep();
    return;
  }
  try {
    await wakeLockSentinel?.release();
  } catch {
    /* ignore */
  }
  wakeLockSentinel = null;
}

/** True if a wake lock is currently held (web only — used to re-request on visibility). */
export function isAwakeHeld(): boolean {
  return wakeLockSentinel !== null;
}

/** Native share sheet on device, Web Share on PWA, clipboard as last resort. */
export async function sharePlain(
  title: string,
  text: string,
): Promise<"shared" | "copied" | "failed"> {
  if (isNative) {
    // @ts-ignore
    await Share.share({ title, text, dialogTitle: 'Share code summary' });
    return "shared";
  }
  const nav = navigator as Navigator & {
    share?: (data: { title?: string; text?: string }) => Promise<void>;
  };
  if (typeof nav.share === "function") {
    try {
      await nav.share({ title, text });
      return "shared";
    } catch {
      /* user cancelled or failed; fall through */
    }
  }
  try {
    await navigator.clipboard.writeText(text);
    return "copied";
  } catch {
    return "failed";
  }
}
