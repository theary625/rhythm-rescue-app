// Media Session integration: lock-screen / Bluetooth headphone controls
// for the active code metronome. Feature-detected; gracefully no-op.

export type MediaPlaybackState = "playing" | "paused" | "none";

interface MediaActionHandlers {
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onNextTrack: () => void;
}

export function isMediaSessionAvailable(): boolean {
  return typeof navigator !== "undefined" && "mediaSession" in navigator;
}

export function setMediaSessionMetadata() {
  if (!isMediaSessionAvailable()) return;
  try {
    if (typeof MediaMetadata === "undefined") return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: "Active Code",
      artist: "MedNurse CodeAssist",
      album: "AHA-aligned cognitive aid",
      artwork: [
        { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
    });
  } catch {
    /* ignore */
  }
}

export function setMediaSessionHandlers(handlers: MediaActionHandlers) {
  if (!isMediaSessionAvailable()) return;
  const ms = navigator.mediaSession;
  const safe = (action: MediaSessionAction, fn: () => void) => {
    try {
      ms.setActionHandler(action, fn);
    } catch {
      /* unsupported action — ignore */
    }
  };
  safe("play", handlers.onPlay);
  safe("pause", handlers.onPause);
  safe("stop", handlers.onStop);
  safe("nexttrack", handlers.onNextTrack);
}

export function clearMediaSessionHandlers() {
  if (!isMediaSessionAvailable()) return;
  const ms = navigator.mediaSession;
  (["play", "pause", "stop", "nexttrack"] as MediaSessionAction[]).forEach((a) => {
    try {
      ms.setActionHandler(a, null);
    } catch {
      /* ignore */
    }
  });
  try {
    ms.metadata = null;
  } catch {
    /* ignore */
  }
  setPlaybackState("none");
}

export function setPlaybackState(state: MediaPlaybackState) {
  if (!isMediaSessionAvailable()) return;
  try {
    navigator.mediaSession.playbackState = state;
  } catch {
    /* ignore */
  }
}
