import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { MedNurseLogo } from "@/brand/MedNurseLogo";
import { PulseCircle } from "@/components/PulseCircle";
import { CodeTimer } from "@/components/CodeTimer";
import { StatCard } from "@/components/StatCard";
import { SegmentedControl } from "@/components/SegmentedControl";
import { Button } from "@/components/Button";
import { CompressorSwitchBanner } from "@/components/CompressorSwitchBanner";
import { PulseCheckOverlay } from "@/components/PulseCheckOverlay";
import { ConfirmModal } from "@/components/ConfirmModal";
import { AclsOverlay } from "@/components/AclsOverlay";
import { RhythmChooserSheet } from "@/components/RhythmChooserSheet";
import { EpiPill } from "@/components/EpiPill";
import { useApp } from "@/lib/app-context";
import { useMetronome } from "@/lib/metronome";
import { useEpiTimer } from "@/lib/useEpiTimer";
import { cn } from "@/lib/utils";
import {
  COMPRESSOR_SWITCH_INTERVAL_MS,
  DEPTH_TARGETS,
  RATIOS,
} from "@/lib/ahaConstants";

export const Route = createFileRoute("/code")({
  head: () => ({
    meta: [
      { title: "Code — MedNurse CodeAssist" },
      { name: "description", content: "Active code screen with CPR metronome and ACLS reference." },
    ],
  }),
  component: CodeScreen,
});

const BPM_PRESETS = [
  { value: "100", label: "100" },
  { value: "110", label: "110" },
  { value: "120", label: "120" },
];

function CodeScreen() {
  const navigate = useNavigate();
  const {
    code,
    startCode,
    stopCode,
    setBpm,
    incrementCompressorSwitch,
    setRhythm,
    sound,
    haptics,
    patientMode,
    rescuers,
    clickPitch,
    clickVolume,
    colorBlindMode,
    recordBeatSample,
    incrementPulseCheck,
  } = useApp();

  const [beatTick, setBeatTick] = useState(0);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [pulseCheckOpen, setPulseCheckOpen] = useState(false);
  const [stopOpen, setStopOpen] = useState(false);
  const [aclsOpen, setAclsOpen] = useState(false);
  const [rhythmChooserOpen, setRhythmChooserOpen] = useState(false);
  const lastSwitchSecondRef = useRef(0);
  const lastSampleSecondRef = useRef(-1);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const bpmRef = useRef(code.bpm);

  useEffect(() => {
    bpmRef.current = code.bpm;
  }, [code.bpm]);

  const epiTimer = useEpiTimer();

  useEffect(() => {
    if (!code.isActive) startCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const metronome = useMetronome({
    bpm: code.bpm,
    soundEnabled: sound,
    hapticsEnabled: haptics,
    pitch: clickPitch,
    volume: clickVolume,
    onBeat: () => setBeatTick((t) => t + 1),
  });

  const startedRef = useRef(false);
  const handleAnyClick = useCallback(() => {
    if (!startedRef.current) {
      metronome.start();
      startedRef.current = true;
    }
  }, [metronome]);

  useEffect(() => {
    return () => metronome.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Wake Lock
  useEffect(() => {
    let cancelled = false;
    const request = async () => {
      try {
        const nav = navigator as Navigator & {
          wakeLock?: { request: (t: "screen") => Promise<WakeLockSentinel> };
        };
        if (nav.wakeLock?.request) {
          const lock = await nav.wakeLock.request("screen");
          if (cancelled) void lock.release();
          else wakeLockRef.current = lock;
        }
      } catch {
        /* ignore */
      }
    };
    void request();
    const onVis = () => {
      if (document.visibilityState === "visible" && !wakeLockRef.current) void request();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVis);
      void wakeLockRef.current?.release();
      wakeLockRef.current = null;
    };
  }, []);

  // Back-button guard
  useEffect(() => {
    window.history.pushState({ codeGuard: true }, "");
    const onPop = () => {
      setStopOpen(true);
      window.history.pushState({ codeGuard: true }, "");
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const handleTimerTick = useCallback(
    (elapsed: number) => {
      const sec = Math.floor(elapsed / 1000);
      if (sec === 0) return;

      // Sample beatHistory once per second (only while metronome is running)
      if (sec !== lastSampleSecondRef.current && metronome.isRunning) {
        lastSampleSecondRef.current = sec;
        recordBeatSample(bpmRef.current);
      }

      if (sec === lastSwitchSecondRef.current) return;
      if (sec % (COMPRESSOR_SWITCH_INTERVAL_MS / 1000) === 0) {
        lastSwitchSecondRef.current = sec;
        setBannerVisible(true);
        metronome.fireAccent(2);
      }
    },
    [metronome, recordBeatSample],
  );

  const handleBpmChange = (v: string) => {
    const n = parseInt(v, 10);
    setBpm(n);
    metronome.setBpm(n);
  };

  const handlePulseCheckOpen = () => {
    metronome.stop();
    setPulseCheckOpen(true);
  };
  const handlePulseCheckResume = () => {
    setPulseCheckOpen(false);
    incrementPulseCheck();
    metronome.start();
  };
  const handlePulseCheckComplete = () => {
    setPulseCheckOpen(false);
    incrementPulseCheck();
    metronome.start();
    toast("Resume compressions. You're ready.", {
      style: { background: "#E63946", color: "#FFFFFF", border: "none" },
    });
  };

  const handleStopConfirm = () => {
    metronome.stop();
    void wakeLockRef.current?.release();
    wakeLockRef.current = null;
    stopCode();
    setStopOpen(false);
    navigate({ to: "/debrief" });
  };

  const handleBannerDismiss = () => {
    setBannerVisible(false);
    incrementCompressorSwitch();
  };

  const handleBannerRhythmCheck = () => {
    setRhythmChooserOpen(true);
  };

  const handleRhythmSelect = (r: "shockable" | "non-shockable") => {
    setRhythm(r);
    setRhythmChooserOpen(false);
    setAclsOpen(true);
  };

  const ratio = RATIOS[patientMode][rescuers];
  const depth = DEPTH_TARGETS[patientMode];
  const modeLabel = `${patientMode[0].toUpperCase()}${patientMode.slice(1)} · ${rescuers === "two" ? "Two" : "Single"}`;
  const bpmStr = String(code.bpm);

  return (
    <div
      className={cn(
        "min-h-screen bg-brand-navy text-brand-white",
        colorBlindMode && "ring-2 ring-dotted ring-brand-red ring-offset-0",
      )}
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
      onClickCapture={handleAnyClick}
    >
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 bg-brand-navy/95 px-4 backdrop-blur">
        <Link to="/" aria-label="Home">
          <MedNurseLogo variant="full" tone="light" className="h-5 w-auto" />
        </Link>
        <CodeTimer
          startedAt={code.startedAt}
          onTick={handleTimerTick}
          className="text-3xl sm:text-5xl"
        />
        <div className="rounded-full bg-brand-accent/30 px-3 py-1 text-xs font-bold">
          {modeLabel}
        </div>
      </header>

      <CompressorSwitchBanner
        visible={bannerVisible}
        onDismiss={handleBannerDismiss}
        onRhythmCheck={handleBannerRhythmCheck}
        colorBlind={colorBlindMode}
      />

      {epiTimer.state !== "idle" && (
        <div className="flex justify-end px-4 pt-2">
          <EpiPill timer={epiTimer} />
        </div>
      )}

      <main className="mx-auto flex max-w-md flex-col gap-6 px-4 py-4">
        <PulseCircle
          bpm={code.bpm}
          running={metronome.isRunning}
          beatTick={beatTick}
          colorBlind={colorBlindMode}
        />

        <div>
          <SegmentedControl options={BPM_PRESETS} value={bpmStr} onChange={handleBpmChange} />
          <p className="mt-2 text-center text-xs text-brand-white/60">
            AHA target: 100–120 compressions per minute.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <StatCard label="Ratio" value={ratio} />
          <StatCard label="Depth" value={depth} />
          <StatCard label="Recoil" value="Full recoil between compressions." />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button variant="secondary" size="lg" onClick={handlePulseCheckOpen}>
            Pulse check
          </Button>
          <Button variant="secondary" size="lg" onClick={() => setAclsOpen(true)}>
            ACLS
          </Button>
          <Button variant="primary" size="lg" onClick={() => setStopOpen(true)}>
            Stop code
          </Button>
        </div>

        <p className="pb-4 pt-2 text-center text-[10px] text-brand-white/40">
          Cognitive aid. Not a replacement for clinical judgment.
        </p>
      </main>

      <PulseCheckOverlay
        open={pulseCheckOpen}
        onResume={handlePulseCheckResume}
        onComplete={handlePulseCheckComplete}
      />

      <RhythmChooserSheet
        open={rhythmChooserOpen}
        onClose={() => setRhythmChooserOpen(false)}
        onSelect={handleRhythmSelect}
      />

      <AclsOverlay open={aclsOpen} onClose={() => setAclsOpen(false)} />

      <ConfirmModal
        open={stopOpen}
        headline="Stop the code?"
        body="This ends the current session. You can review the summary next."
        confirmLabel="Stop code"
        cancelLabel="Keep going"
        onConfirm={handleStopConfirm}
        onCancel={() => setStopOpen(false)}
      />
    </div>
  );
}
