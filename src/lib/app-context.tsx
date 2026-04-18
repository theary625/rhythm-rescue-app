import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { BPM_DEFAULT } from "./ahaConstants";

export type PatientMode = "adult" | "pediatric" | "infant";
export type RescuerCount = "single" | "two";

interface ActiveCode {
  isActive: boolean;
  startedAt: number | null;
  bpm: number;
  compressorSwitchCount: number;
  finalElapsedMs: number;
}

interface AppState {
  patientMode: PatientMode;
  setPatientMode: (m: PatientMode) => void;
  rescuers: RescuerCount;
  setRescuers: (r: RescuerCount) => void;
  sound: boolean;
  setSound: (b: boolean) => void;
  haptics: boolean;
  setHaptics: (b: boolean) => void;
  disclaimerAccepted: boolean;
  acceptDisclaimer: () => void;
  resetDisclaimer: () => void;
  // Active code slice
  code: ActiveCode;
  startCode: () => void;
  stopCode: () => void;
  setBpm: (n: number) => void;
  incrementCompressorSwitch: () => void;
}

const KEY = "mednurse";
const Ctx = createContext<AppState | null>(null);

function read<T>(k: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = window.localStorage.getItem(`${KEY}.${k}`);
    return v === null ? fallback : (JSON.parse(v) as T);
  } catch {
    return fallback;
  }
}

function write<T>(k: string, v: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(`${KEY}.${k}`, JSON.stringify(v));
  } catch {
    /* ignore */
  }
}

const INITIAL_CODE: ActiveCode = {
  isActive: false,
  startedAt: null,
  bpm: BPM_DEFAULT,
  compressorSwitchCount: 0,
  finalElapsedMs: 0,
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [patientMode, setPatientModeState] = useState<PatientMode>("adult");
  const [rescuers, setRescuersState] = useState<RescuerCount>("two");
  const [sound, setSoundState] = useState(true);
  const [haptics, setHapticsState] = useState(true);
  const [disclaimerAccepted, setDisclaimer] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [code, setCode] = useState<ActiveCode>(INITIAL_CODE);

  useEffect(() => {
    setPatientModeState(read<PatientMode>("patientMode", "adult"));
    setRescuersState(read<RescuerCount>("rescuers", "two"));
    setSoundState(read<boolean>("sound", true));
    setHapticsState(read<boolean>("haptics", true));
    setDisclaimer(read<boolean>("disclaimerAccepted", false));
    setHydrated(true);
  }, []);

  const setPatientMode = (m: PatientMode) => {
    setPatientModeState(m);
    write("patientMode", m);
  };
  const setRescuers = (r: RescuerCount) => {
    setRescuersState(r);
    write("rescuers", r);
  };
  const setSound = (b: boolean) => {
    setSoundState(b);
    write("sound", b);
  };
  const setHaptics = (b: boolean) => {
    setHapticsState(b);
    write("haptics", b);
  };
  const acceptDisclaimer = () => {
    setDisclaimer(true);
    write("disclaimerAccepted", true);
  };
  const resetDisclaimer = () => {
    setDisclaimer(false);
    write("disclaimerAccepted", false);
  };

  const startCode = useCallback(() => {
    setCode({
      isActive: true,
      startedAt: Date.now(),
      bpm: BPM_DEFAULT,
      compressorSwitchCount: 0,
      finalElapsedMs: 0,
    });
  }, []);

  const stopCode = useCallback(() => {
    setCode((prev) => ({
      ...prev,
      isActive: false,
      finalElapsedMs: prev.startedAt ? Date.now() - prev.startedAt : 0,
    }));
  }, []);

  const setBpm = useCallback((n: number) => {
    setCode((prev) => ({ ...prev, bpm: n }));
  }, []);

  const incrementCompressorSwitch = useCallback(() => {
    setCode((prev) => ({ ...prev, compressorSwitchCount: prev.compressorSwitchCount + 1 }));
  }, []);

  return (
    <Ctx.Provider
      value={{
        patientMode,
        setPatientMode,
        rescuers,
        setRescuers,
        sound,
        setSound,
        haptics,
        setHaptics,
        disclaimerAccepted: hydrated ? disclaimerAccepted : true,
        acceptDisclaimer,
        resetDisclaimer,
        code,
        startCode,
        stopCode,
        setBpm,
        incrementCompressorSwitch,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
