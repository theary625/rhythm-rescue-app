import { useEffect, useRef, useState } from "react";
import { Volume2, Pause, Play } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { speakSequence, speakText, type SequenceHandle, type SpeakHandle } from "@/lib/voice";
import { cn } from "@/lib/utils";

/**
 * Small per-step speaker button. Hidden when voice is disabled in Settings.
 * Tapping speaks the supplied text. Tapping while speaking stops it.
 */
export function StepSpeakButton({ text, label }: { text: string; label?: string }) {
  const { voicePromptsEnabled } = useApp();
  const [busy, setBusy] = useState(false);
  const handleRef = useRef<SpeakHandle | null>(null);

  useEffect(() => {
    return () => {
      handleRef.current?.stop();
    };
  }, []);

  if (!voicePromptsEnabled) return null;

  const onClick = () => {
    if (busy) {
      handleRef.current?.stop();
      handleRef.current = null;
      setBusy(false);
      return;
    }
    setBusy(true);
    const h = speakText(text);
    handleRef.current = h;
    void h.done.then(() => setBusy(false));
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={busy ? "Stop reading" : label ?? "Read step aloud"}
      className={cn(
        "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brand-softblue/40 text-brand-softblue transition-colors",
        busy
          ? "bg-brand-softblue text-brand-navy"
          : "bg-transparent hover:bg-brand-softblue/15",
      )}
    >
      <Volume2 className="h-4 w-4" />
    </button>
  );
}

/**
 * Walkthrough bar that reads a sequence of steps aloud, advancing automatically.
 * Hidden when voice is disabled in Settings. Shows the active step number.
 */
export function WalkthroughBar({ steps }: { steps: string[] }) {
  const { voicePromptsEnabled } = useApp();
  const [activeIdx, setActiveIdx] = useState<number>(-1);
  const handleRef = useRef<SequenceHandle | null>(null);

  useEffect(() => {
    return () => {
      handleRef.current?.stop();
    };
  }, []);

  if (!voicePromptsEnabled || steps.length === 0) return null;

  const playing = activeIdx >= 0;

  const start = () => {
    const h = speakSequence(steps, (i) => setActiveIdx(i));
    handleRef.current = h;
    void h.done.then(() => setActiveIdx(-1));
  };
  const stop = () => {
    handleRef.current?.stop();
    handleRef.current = null;
    setActiveIdx(-1);
  };

  return (
    <div className="sticky top-0 z-10 -mx-4 flex items-center gap-3 border-b border-white/10 bg-brand-navy/95 px-4 py-2 backdrop-blur">
      <button
        type="button"
        onClick={playing ? stop : start}
        className={cn(
          "inline-flex min-h-9 items-center gap-2 rounded-full px-3 text-xs font-bold transition-colors",
          playing
            ? "bg-brand-red text-brand-white"
            : "bg-brand-softblue text-brand-navy hover:brightness-110",
        )}
      >
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        {playing ? "Stop walkthrough" : "Read aloud"}
      </button>
      <span className="text-[11px] text-brand-white/60">
        {playing
          ? `Step ${Math.min(activeIdx + 1, steps.length)} of ${steps.length}`
          : `${steps.length} steps · hands-free`}
      </span>
    </div>
  );
}
