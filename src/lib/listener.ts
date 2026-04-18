// Hands-free voice command listener for MedNurse CodeAssist.
// Uses the Web Speech Recognition API (Chromium-based browsers).
// No audio is recorded, stored, or transmitted by this app.

export type VoiceCommand =
  | "start-code"
  | "stop-code"
  | "confirm-stop"
  | "pulse-check"
  | "log-epi"
  | "rhythm-shockable"
  | "rhythm-non-shockable"
  | "switch-compressor";

interface SR {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((ev: SpeechRecognitionEventLike) => void) | null;
  onerror: ((ev: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface SpeechRecognitionEventLike {
  results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean; length: number }>;
  resultIndex: number;
}

interface SRCtor {
  new (): SR;
}

function getCtor(): SRCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SRCtor;
    webkitSpeechRecognition?: SRCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function isListenerAvailable(): boolean {
  return !!getCtor();
}

// Match phrases case-insensitively. First match wins.
const PHRASES: Array<{ phrases: string[]; cmd: VoiceCommand }> = [
  { phrases: ["confirm stop"], cmd: "confirm-stop" },
  { phrases: ["stop code"], cmd: "stop-code" },
  { phrases: ["start code"], cmd: "start-code" },
  { phrases: ["pulse check"], cmd: "pulse-check" },
  { phrases: ["log epi", "epi given", "epinephrine given"], cmd: "log-epi" },
  { phrases: ["non shockable", "not shockable"], cmd: "rhythm-non-shockable" },
  { phrases: ["shockable"], cmd: "rhythm-shockable" },
  { phrases: ["switch compressor"], cmd: "switch-compressor" },
];

function matchCommand(text: string): VoiceCommand | null {
  const t = text.toLowerCase();
  for (const p of PHRASES) {
    if (p.phrases.some((ph) => t.includes(ph))) return p.cmd;
  }
  return null;
}

export interface ListenerHandle {
  stop: () => void;
}

export function startListener(opts: {
  onCommand: (cmd: VoiceCommand) => void;
  onError: (err: string) => void;
}): ListenerHandle | null {
  const Ctor = getCtor();
  if (!Ctor) return null;
  let stopped = false;
  let rec: SR | null = null;

  const create = () => {
    const r = new Ctor();
    r.continuous = true;
    r.interimResults = false;
    r.lang = "en-US";
    r.onresult = (ev) => {
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const res = ev.results[i];
        if (!res || !res.isFinal) continue;
        const transcript = res[0]?.transcript ?? "";
        const cmd = matchCommand(transcript);
        if (cmd) opts.onCommand(cmd);
      }
    };
    r.onerror = (ev) => {
      // not-allowed and service-not-allowed are permission/availability failures.
      if (ev.error === "not-allowed" || ev.error === "service-not-allowed") {
        opts.onError(ev.error);
        stopped = true;
      }
    };
    r.onend = () => {
      // Auto-restart unless intentionally stopped.
      if (stopped) return;
      try {
        r.start();
      } catch {
        /* ignore */
      }
    };
    return r;
  };

  try {
    rec = create();
    rec.start();
  } catch (e) {
    opts.onError(String(e));
    return null;
  }

  return {
    stop: () => {
      stopped = true;
      try {
        rec?.abort();
      } catch {
        /* ignore */
      }
    },
  };
}
