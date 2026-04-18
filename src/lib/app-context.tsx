import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { BPM_DEFAULT } from "./ahaConstants";

export type PatientMode = "adult" | "pediatric" | "infant";
export type RescuerCount = "single" | "two";
export type Rhythm = "shockable" | "non-shockable";

export interface DrugLogEntry {
  name: string;
  at: number;
  doseDisplay: string;
}

interface ActiveCode {
  isActive: boolean;
  startedAt: number | null;
  bpm: number;
  compressorSwitchCount: number;
  finalElapsedMs: number;
  // Pass 3
  patientWeightKg: number | null;
  currentRhythm: Rhythm | null;
  rhythmCheckCount: number;
  epiLastDoseAt: number | null;
  epiDosesGiven: number;
  drugLog: DrugLogEntry[];
  causesConsidered: string[];
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
  code: ActiveCode;
  startCode: () => void;
  stopCode: () => void;
  setBpm: (n: number) => void;
  incrementCompressorSwitch: () => void;
  // Pass 3 actions
  setWeight: (kg: number | null) => void;
  setRhythm: (r: Rhythm) => void;
  logEpi: () => void;
  logDrug: (entry: { name: string; doseDisplay: string }) => void;
  toggleCause: (label: string) => void;
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
  patientWeightKg: null,
  currentRhythm: null,
  rhythmCheckCount: 0,
  epiLastDoseAt: null,
  epiDosesGiven: 0,
  drugLog: [],
  causesConsidered: [],
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
    setCode({ ...INITIAL_CODE, isActive: true, startedAt: Date.now() });
  }, []);

  const stopCode = useCallback(() => {
    setCode((prev) => ({
      ...prev,
      isActive: false,
      finalElapsedMs: prev.startedAt ? Date.now() - prev.startedAt : 0,
      // Clear ephemeral session data
      patientWeightKg: null,
      currentRhythm: prev.currentRhythm, // preserve for debrief view briefly; not persisted
      epiLastDoseAt: null,
      drugLog: prev.drugLog, // keep for debrief reference
      causesConsidered: prev.causesConsidered,
    }));
  }, []);

  const setBpm = useCallback((n: number) => {
    setCode((prev) => ({ ...prev, bpm: n }));
  }, []);

  const incrementCompressorSwitch = useCallback(() => {
    setCode((prev) => ({ ...prev, compressorSwitchCount: prev.compressorSwitchCount + 1 }));
  }, []);

  const setWeight = useCallback((kg: number | null) => {
    setCode((prev) => ({ ...prev, patientWeightKg: kg }));
  }, []);

  const setRhythm = useCallback((r: Rhythm) => {
    setCode((prev) => ({
      ...prev,
      currentRhythm: r,
      rhythmCheckCount: prev.rhythmCheckCount + 1,
    }));
  }, []);

  const logEpi = useCallback(() => {
    const at = Date.now();
    setCode((prev) => ({
      ...prev,
      epiLastDoseAt: at,
      epiDosesGiven: prev.epiDosesGiven + 1,
      drugLog: [...prev.drugLog, { name: "Epinephrine", at, doseDisplay: "1 mg IV/IO" }],
    }));
  }, []);

  const logDrug = useCallback((entry: { name: string; doseDisplay: string }) => {
    setCode((prev) => ({
      ...prev,
      drugLog: [...prev.drugLog, { ...entry, at: Date.now() }],
    }));
  }, []);

  const toggleCause = useCallback((label: string) => {
    setCode((prev) => {
      const has = prev.causesConsidered.includes(label);
      return {
        ...prev,
        causesConsidered: has
          ? prev.causesConsidered.filter((c) => c !== label)
          : [...prev.causesConsidered, label],
      };
    });
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
        setWeight,
        setRhythm,
        logEpi,
        logDrug,
        toggleCause,
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
