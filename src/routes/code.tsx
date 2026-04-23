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
import { MicIndicator } from "@/components/MicIndicator";
import { useApp } from "@/lib/app-context";
import { useMetronome } from "@/lib/metronome";
import { useEpiTimer } from "@/lib/useEpiTimer";
import { speak, VOICE_LINES } from "@/lib/voice";
import { startListener, isListenerAvailable, type VoiceCommand } from "@/lib/listener";
import {
  setMediaSessionMetadata,
  setMediaSessionHandlers,
  clearMediaSessionHandlers,
  setPlaybackState,
} from "@/lib/mediaSession";
import { keepAwakeOn, keepAwakeOff, isAwakeHeld } from "@/lib/platform";
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
    logEpi,
    sound,
    haptics,
    patientMode,
    rescuers,
    clickPitch,
    clickVolume,
    colorBlindMode,
    compactMode,
    handsFreeEnabled,
    setHandsFreeEnabled,
    recordBeatSample,
    incrementPulseCheck,
  } = useApp();

  const [beatTick, setBeatTick] = useState(0);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [pulseCheckOpen, setPulseCheckOpen] = useState(false);
  const [stopOpen, setStopOpen] = useState(false);
  const [aclsOpen, setAclsOpen] = useState(false);
  const [rhythmChooserOpen, setRhythmChooserOpen] = useState(false);
  const [sessionCompact, setSessionCompact] = useState<boolean | null>(null);
  const [micActive, setMicActive] = useState(false);
  const lastSwitchSecondRef = useRef(0);
  const lastSampleSecondRef = useRef(-1);
  const bpmRef = useRef(code.bpm);

  const isCompact = sessionCompact ?? compactMode;

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

  // Keep screen on during an active code (web Wake Lock today; Capacitor KeepAwake on native).
  useEffect(() => {
    void keepAwakeOn();
    const onVis = () => {
      if (document.visibilityState === "visible" && !isAwakeHeld()) void keepAwakeOn();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      void keepAwakeOff();
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

      if (sec !== lastSampleSecondRef.current && metronome.isRunning) {
        lastSampleSecondRef.current = sec;
        recordBeatSample(bpmRef.current);
      }

      if (sec === lastSwitchSecondRef.current) return;
      if (sec % (COMPRESSOR_SWITCH_INTERVAL_MS / 1000) === 0) {
        lastSwitchSecondRef.current = sec;
        setBannerVisible(true);
        metronome.fireAccent(2);
        speak(VOICE_LINES.switchAndRhythm, { priority: "urgent" });
      }
    },
    [metronome, recordBeatSample],
  );

  const handleBpmChange = (v: string) => {
    const n = parseInt(v, 10);
    setBpm(n);
    metronome.setBpm(n);
  };

  const handlePulseCheckOpen = useCallback(() => {
    metronome.stop();
    setPlaybackState("paused");
    speak(VOICE_LINES.pulseStart, { priority: "urgent" });
    setPulseCheckOpen(true);
  }, [metronome]);

  const handlePulseCheckResume = () => {
    setPulseCheckOpen(false);
    incrementPulseCheck();
    speak(VOICE_LINES.pulseEnd, { priority: "urgent" });
    metronome.start();
    setPlaybackState("playing");
  };
  const handlePulseCheckComplete = () => {
    setPulseCheckOpen(false);
    incrementPulseCheck();
    speak(VOICE_LINES.pulseEnd, { priority: "urgent" });
    metronome.start();
    setPlaybackState("playing");
    toast("Resume compressions. You're ready.", {
      style: { background: "#E63946", color: "#FFFFFF", border: "none" },
    });
  };

  const handleStopConfirm = useCallback(() => {
    metronome.stop();
    void keepAwakeOff();
    speak(VOICE_LINES.codeEnded);
    stopCode();
    setStopOpen(false);
    navigate({ to: "/debrief" });
  }, [metronome, stopCode, navigate]);

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
    speak(
      r === "shockable" ? VOICE_LINES.rhythmShockable : VOICE_LINES.rhythmNonShockable,
      { priority: "urgent" },
    );
    setAclsOpen(true);
  };

  const handleEpiLog = useCallback(() => {
    logEpi();
    speak(VOICE_LINES.epiLogged);
  }, [logEpi]);

  // Media Session
  useEffect(() => {
    setMediaSessionMetadata();
    setMediaSessionHandlers({
      onPlay: () => {
        if (!metronome.isRunning) {
          metronome.start();
          setPlaybackState("playing");
        }
      },
      onPause: () => {
        if (pulseCheckOpen) return; // no-op during pulse check
        if (metronome.isRunning) {
          metronome.stop();
          setPlaybackState("paused");
        }
      },
      onStop: () => setStopOpen(true),
      onNextTrack: () => handleEpiLog(),
    });
    setPlaybackState(metronome.isRunning ? "playing" : "paused");
    return () => clearMediaSessionHandlers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metronome.isRunning, pulseCheckOpen, handleEpiLog]);

  // Hands-free listener
  useEffect(() => {
    if (!handsFreeEnabled || !isListenerAvailable()) {
      setMicActive(false);
      return;
    }
    const handle = startListener({
      onCommand: (cmd: VoiceCommand) => {
        switch (cmd) {
          case "stop-code":
            setStopOpen(true);
            break;
          case "confirm-stop":
            speak(VOICE_LINES.codeEnded);
            handleStopConfirm();
            break;
          case "pulse-check":
            handlePulseCheckOpen();
            break;
          case "log-epi":
            handleEpiLog();
            break;
          case "rhythm-shockable":
            speak(VOICE_LINES.shockableLogged);
            handleRhythmSelect("shockable");
            break;
          case "rhythm-non-shockable":
            speak(VOICE_LINES.nonShockableLogged);
            handleRhythmSelect("non-shockable");
            break;
          case "switch-compressor":
            speak(VOICE_LINES.switchLogged);
            incrementCompressorSwitch();
            setBannerVisible(false);
            break;
          default:
            break;
        }
      },
      onError: () => {
        setHandsFreeEnabled(false);
        setMicActive(false);
        toast("Hands-free unavailable on this device.");
      },
    });
    if (handle) setMicActive(true);
    return () => {
      handle?.stop();
      setMicActive(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handsFreeEnabled]);

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
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
      onClickCapture={handleAnyClick}
    >
      {!isCompact && (
        <header
          className="sticky top-0 z-20 bg-brand-navy/95 px-4 backdrop-blur"
          style={{ paddingTop: "env(safe-area-inset-top)" }}
        >
          <div className="flex h-14 items-center justify-between gap-3">
            <Link to="/" aria-label="Home">
              <MedNurseLogo variant="full" tone="light" className="h-5 w-auto" />
            </Link>
            <CodeTimer
              startedAt={code.startedAt}
              onTick={handleTimerTick}
              className="text-4xl sm:text-5xl"
            />
            <div className="flex items-center gap-2">
              <MicIndicator active={micActive} onToggleOff={() => setHandsFreeEnabled(false)} />
              <div className="rounded-full bg-brand-accent/60 px-3 py-1.5 text-xs font-bold text-brand-white">
                {modeLabel}
              </div>
            </div>
          </div>
        </header>
      )}

      {isCompact && (
        <header
          className="sticky top-0 z-20 bg-brand-navy/95 px-4 backdrop-blur"
          style={{ paddingTop: "env(safe-area-inset-top)" }}
        >
          <div className="flex h-16 items-center justify-between gap-3">
            <MicIndicator active={micActive} onToggleOff={() => setHandsFreeEnabled(false)} />
            <CodeTimer
              startedAt={code.startedAt}
              onTick={handleTimerTick}
              className="text-5xl sm:text-6xl"
            />
            <div className="w-12" />
          </div>
        </header>
      )}

      <CompressorSwitchBanner
        visible={bannerVisible}
        onDismiss={handleBannerDismiss}
        onRhythmCheck={handleBannerRhythmCheck}
        colorBlind={colorBlindMode}
        compact={isCompact}
      />

      {!isCompact && epiTimer.state !== "idle" && (
        <div className="flex justify-end px-4 pt-2">
          <EpiPill timer={epiTimer} />
        </div>
      )}

      {isCompact ? (
        <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col items-center justify-between px-4 py-6">
          <div className="flex w-full flex-1 items-center justify-center">
            <PulseCircle
              bpm={code.bpm}
              running={metronome.isRunning}
              beatTick={beatTick}
              colorBlind={colorBlindMode}
            />
          </div>
          <div className="grid w-full grid-cols-2 gap-2">
            <Button variant="secondary" size="lg" onClick={handlePulseCheckOpen}>
              Pulse check
            </Button>
            <Button variant="primary" size="lg" onClick={() => setStopOpen(true)}>
              Stop code
            </Button>
          </div>
          <button
            type="button"
            onClick={() => setSessionCompact(false)}
            className="mt-3 text-xs font-semibold text-brand-white/60 underline-offset-4 hover:underline"
          >
            Exit compact mode
          </button>
          <p className="pt-3 text-center text-[10px] text-brand-white/40">
            Cognitive aid. Not a replacement for clinical judgment.
          </p>
        </main>
      ) : (
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
      )}

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
