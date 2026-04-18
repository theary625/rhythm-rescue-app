import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { BPM_DEFAULT } from "./ahaConstants";

export type PatientMode = "adult" | "pediatric" | "infant";
export type RescuerCount = "single" | "two";
export type Rhythm = "shockable" | "non-shockable";
export type ClickPitch = "low" | "mid" | "high";

export interface DrugLogEntry {
  name: string;
  at: number;
  doseDisplay: string;
}

export interface HistoryEntry {
  id: string;
  endedAt: number;
  durationSec: number;
  mode: PatientMode;
  rescuers: RescuerCount;
  avgBpm: number | null;
  pctInTarget: number | null;
  compressorSwitches: number;
  rhythmChecks: number;
  pulseChecks: number;
  epiDoses: number;
  drugLog: Array<{ name: string; doseDisplay: string; offsetSec: number }>;
  causesConsidered: string[];
  notes: string;
  /** Where this session was recorded. Defaults to "phone" for legacy entries. */
  source?: "phone" | "watch";
}

/** Minimal payload sent by the watchOS companion app via WatchConnectivity. */
export interface WatchSummaryPayload {
  endedAt: number; // ms epoch
  durationSec: number;
  avgBpm: number | null;
  compressorSwitches: number;
}

interface ActiveCode {
  isActive: boolean;
  startedAt: number | null;
  bpm: number;
  compressorSwitchCount: number;
  finalElapsedMs: number;
  patientWeightKg: number | null;
  currentRhythm: Rhythm | null;
  rhythmCheckCount: number;
  epiLastDoseAt: number | null;
  epiDosesGiven: number;
  drugLog: DrugLogEntry[];
  causesConsidered: string[];
  beatHistory: number[];
  pulseChecksCount: number;
}

interface Preferences {
  defaultBpm: number;
  clickPitch: ClickPitch;
  clickVolume: number;
  colorBlindMode: boolean;
  // Pass 5
  voicePromptsEnabled: boolean;
  voiceVolume: number;
  preferredVoiceURI: string | null;
  handsFreeEnabled: boolean;
  compactMode: boolean;
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
  // preferences (Pass 4)
  defaultBpm: number;
  setDefaultBpm: (n: number) => void;
  clickPitch: ClickPitch;
  setClickPitch: (p: ClickPitch) => void;
  clickVolume: number;
  setClickVolume: (n: number) => void;
  colorBlindMode: boolean;
  setColorBlindMode: (b: boolean) => void;
  voicePromptsEnabled: boolean;
  setVoicePromptsEnabled: (b: boolean) => void;
  voiceVolume: number;
  setVoiceVolume: (n: number) => void;
  preferredVoiceURI: string | null;
  setPreferredVoiceURI: (s: string | null) => void;
  handsFreeEnabled: boolean;
  setHandsFreeEnabled: (b: boolean) => void;
  compactMode: boolean;
  setCompactMode: (b: boolean) => void;
  resetPreferences: () => void;
  // disclaimer + onboarding
  disclaimerAccepted: boolean;
  acceptDisclaimer: () => void;
  resetDisclaimer: () => void;
  onboardingComplete: boolean;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  // active code
  code: ActiveCode;
  startCode: () => void;
  stopCode: () => void;
  setBpm: (n: number) => void;
  incrementCompressorSwitch: () => void;
  setWeight: (kg: number | null) => void;
  setRhythm: (r: Rhythm) => void;
  logEpi: () => void;
  logDrug: (entry: { name: string; doseDisplay: string }) => void;
  toggleCause: (label: string) => void;
  recordBeatSample: (bpm: number) => void;
  incrementPulseCheck: () => void;
  // history
  history: HistoryEntry[];
  saveToHistory: (notes: string) => HistoryEntry;
  deleteHistoryEntry: (id: string) => void;
  clearHistory: () => void;
  // hydration
  hydrated: boolean;
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
  beatHistory: [],
  pulseChecksCount: 0,
};

const DEFAULT_PREFS: Preferences = {
  defaultBpm: BPM_DEFAULT,
  clickPitch: "mid",
  clickVolume: 60,
  colorBlindMode: false,
  voicePromptsEnabled: false,
  voiceVolume: 70,
  preferredVoiceURI: null,
  handsFreeEnabled: false,
  compactMode: false,
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [patientMode, setPatientModeState] = useState<PatientMode>("adult");
  const [rescuers, setRescuersState] = useState<RescuerCount>("two");
  const [sound, setSoundState] = useState(true);
  const [haptics, setHapticsState] = useState(true);
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFS);
  const [disclaimerAccepted, setDisclaimer] = useState(true);
  const [onboardingComplete, setOnboarding] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [code, setCode] = useState<ActiveCode>(INITIAL_CODE);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setPatientModeState(read<PatientMode>("patientMode", "adult"));
    setRescuersState(read<RescuerCount>("rescuers", "two"));
    setSoundState(read<boolean>("sound", true));
    setHapticsState(read<boolean>("haptics", true));
    const p = read<Preferences>("preferences", DEFAULT_PREFS);
    setPrefs({ ...DEFAULT_PREFS, ...p });
    setDisclaimer(read<boolean>("disclaimerAccepted", false));
    setOnboarding(read<boolean>("onboardingComplete", false));
    setHistory(read<HistoryEntry[]>("history", []));
    // initialize code bpm with defaultBpm
    setCode((prev) => ({ ...prev, bpm: (p && p.defaultBpm) || BPM_DEFAULT }));
    setHydrated(true);
  }, []);

  const writePrefs = (next: Preferences) => {
    setPrefs(next);
    write("preferences", next);
  };

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
  const setDefaultBpm = (n: number) => writePrefs({ ...prefs, defaultBpm: n });
  const setClickPitch = (p: ClickPitch) => writePrefs({ ...prefs, clickPitch: p });
  const setClickVolume = (n: number) => writePrefs({ ...prefs, clickVolume: n });
  const setColorBlindMode = (b: boolean) => writePrefs({ ...prefs, colorBlindMode: b });
  const setVoicePromptsEnabled = (b: boolean) =>
    writePrefs({ ...prefs, voicePromptsEnabled: b });
  const setVoiceVolume = (n: number) => writePrefs({ ...prefs, voiceVolume: n });
  const setPreferredVoiceURI = (s: string | null) =>
    writePrefs({ ...prefs, preferredVoiceURI: s });
  const setHandsFreeEnabled = (b: boolean) => writePrefs({ ...prefs, handsFreeEnabled: b });
  const setCompactMode = (b: boolean) => writePrefs({ ...prefs, compactMode: b });
  const resetPreferences = () => {
    writePrefs(DEFAULT_PREFS);
    setPatientMode("adult");
    setRescuers("two");
    setSound(true);
    setHaptics(true);
  };

  const acceptDisclaimer = () => {
    setDisclaimer(true);
    write("disclaimerAccepted", true);
  };
  const resetDisclaimer = () => {
    setDisclaimer(false);
    write("disclaimerAccepted", false);
  };
  const completeOnboarding = () => {
    setOnboarding(true);
    write("onboardingComplete", true);
  };
  const resetOnboarding = () => {
    setOnboarding(false);
    write("onboardingComplete", false);
  };

  const startCode = useCallback(() => {
    setCode({ ...INITIAL_CODE, bpm: prefs.defaultBpm, isActive: true, startedAt: Date.now() });
  }, [prefs.defaultBpm]);

  const stopCode = useCallback(() => {
    setCode((prev) => ({
      ...prev,
      isActive: false,
      finalElapsedMs: prev.startedAt ? Date.now() - prev.startedAt : 0,
      // keep ephemeral fields for the debrief render; they will be cleared
      // when the user either Saves (and we clear) or returns Home (next startCode resets).
      patientWeightKg: prev.patientWeightKg,
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

  const recordBeatSample = useCallback((bpm: number) => {
    setCode((prev) => ({ ...prev, beatHistory: [...prev.beatHistory, bpm] }));
  }, []);

  const incrementPulseCheck = useCallback(() => {
    setCode((prev) => ({ ...prev, pulseChecksCount: prev.pulseChecksCount + 1 }));
  }, []);

  const writeHistory = (next: HistoryEntry[]) => {
    setHistory(next);
    write("history", next);
  };

  const saveToHistory = useCallback((notes: string): HistoryEntry => {
    const startedAt = code.startedAt ?? Date.now();
    const endedAt = startedAt + code.finalElapsedMs;
    const beats = code.beatHistory;
    const avgBpm = beats.length
      ? Math.round(beats.reduce((a, b) => a + b, 0) / beats.length)
      : null;
    const pctInTarget = beats.length
      ? Math.round((100 * beats.filter((b) => b >= 100 && b <= 120).length) / beats.length)
      : null;
    const entry: HistoryEntry = {
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      endedAt,
      durationSec: Math.round(code.finalElapsedMs / 1000),
      mode: patientMode,
      rescuers,
      avgBpm,
      pctInTarget,
      compressorSwitches: code.compressorSwitchCount,
      rhythmChecks: code.rhythmCheckCount,
      pulseChecks: code.pulseChecksCount,
      epiDoses: code.epiDosesGiven,
      drugLog: code.drugLog.map((d) => ({
        name: d.name,
        doseDisplay: d.doseDisplay,
        offsetSec: Math.max(0, Math.round((d.at - startedAt) / 1000)),
      })),
      causesConsidered: code.causesConsidered,
      notes,
    };
    const next = [entry, ...history].slice(0, 5);
    writeHistory(next);
    // clear ephemeral code state after save
    setCode(INITIAL_CODE);
    return entry;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, history, patientMode, rescuers]);

  const deleteHistoryEntry = useCallback(
    (id: string) => {
      writeHistory(history.filter((e) => e.id !== id));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [history],
  );

  const clearHistory = useCallback(() => writeHistory([]), []);

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
        defaultBpm: prefs.defaultBpm,
        setDefaultBpm,
        clickPitch: prefs.clickPitch,
        setClickPitch,
        clickVolume: prefs.clickVolume,
        setClickVolume,
        colorBlindMode: prefs.colorBlindMode,
        setColorBlindMode,
        voicePromptsEnabled: prefs.voicePromptsEnabled,
        setVoicePromptsEnabled,
        voiceVolume: prefs.voiceVolume,
        setVoiceVolume,
        preferredVoiceURI: prefs.preferredVoiceURI,
        setPreferredVoiceURI,
        handsFreeEnabled: prefs.handsFreeEnabled,
        setHandsFreeEnabled,
        compactMode: prefs.compactMode,
        setCompactMode,
        resetPreferences,
        disclaimerAccepted: hydrated ? disclaimerAccepted : true,
        acceptDisclaimer,
        resetDisclaimer,
        onboardingComplete: hydrated ? onboardingComplete : true,
        completeOnboarding,
        resetOnboarding,
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
        recordBeatSample,
        incrementPulseCheck,
        history,
        saveToHistory,
        deleteHistoryEntry,
        clearHistory,
        hydrated,
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
