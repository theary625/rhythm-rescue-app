// Centralized speech synthesis service for MedNurse CodeAssist.
// Event-driven only — no continuous narration.

export type SpeakPriority = "normal" | "urgent";
export interface SpeakOptions {
  priority?: SpeakPriority;
}

let enabled = false;
let volume = 0.7; // 0..1
let preferredVoiceURI: string | null = null;

function getSynth(): SpeechSynthesis | null {
  if (typeof window === "undefined") return null;
  return window.speechSynthesis ?? null;
}

export function isVoiceAvailable(): boolean {
  return !!getSynth();
}

export function configureVoice(opts: {
  enabled: boolean;
  volume: number; // 0..100
  preferredVoiceURI: string | null;
}) {
  enabled = !!opts.enabled;
  volume = Math.max(0, Math.min(1, (opts.volume ?? 70) / 100));
  preferredVoiceURI = opts.preferredVoiceURI ?? null;
  if (!enabled) {
    cancelAll();
  }
}

export function listEnglishVoices(): SpeechSynthesisVoice[] {
  const synth = getSynth();
  if (!synth) return [];
  return synth.getVoices().filter((v) => /^en/i.test(v.lang));
}

function pickVoice(): SpeechSynthesisVoice | null {
  const synth = getSynth();
  if (!synth) return null;
  const voices = synth.getVoices();
  if (preferredVoiceURI) {
    const m = voices.find((v) => v.voiceURI === preferredVoiceURI);
    if (m) return m;
  }
  return voices.find((v) => /^en/i.test(v.lang)) ?? voices[0] ?? null;
}

export function speak(line: string, opts: SpeakOptions = {}): void {
  if (!enabled) return;
  const synth = getSynth();
  if (!synth) return;
  if (opts.priority === "urgent") synth.cancel();
  const utt = new SpeechSynthesisUtterance(line);
  utt.rate = 1.0;
  utt.pitch = 1.0;
  utt.volume = volume;
  const v = pickVoice();
  if (v) utt.voice = v;
  try {
    synth.speak(utt);
  } catch {
    /* ignore */
  }
}

export function cancelAll(): void {
  const synth = getSynth();
  if (!synth) return;
  try {
    synth.cancel();
  } catch {
    /* ignore */
  }
}

// Final prompt strings — do not paraphrase.
export const VOICE_LINES = {
  codeStart: "You're ready. Begin compressions.",
  switchAndRhythm: "Switch compressor. Rhythm check.",
  pulseStart: "Pulse check. Ten seconds.",
  pulseEnd: "Resume compressions.",
  epiLogged: "Epinephrine logged. Next dose window in three minutes.",
  epiWindow: "Epinephrine window is open.",
  epiDue: "Epinephrine is due.",
  rhythmShockable: "Shockable rhythm. Prepare to defibrillate.",
  rhythmNonShockable:
    "Non-shockable rhythm. Continue compressions. Give epinephrine as soon as possible.",
  codeEnded: "Code ended. Review the summary.",
  // hands-free confirmations
  startingCode: "Starting code.",
  confirmStop: "Confirm stop code.",
  pulseCheckCmd: "Pulse check. Ten seconds.",
  shockableLogged: "Shockable rhythm logged.",
  nonShockableLogged: "Non-shockable rhythm logged.",
  switchLogged: "Compressor switch logged.",
} as const;
