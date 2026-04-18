import { useEffect, useState } from "react";
import { listEnglishVoices } from "@/lib/voice";

interface Props {
  value: string | null;
  onChange: (uri: string | null) => void;
}

export function VoicePicker({ value, onChange }: Props) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const update = () => setVoices(listEnglishVoices());
    update();
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = update;
      return () => {
        if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, []);

  if (voices.length === 0) {
    return (
      <p className="text-sm text-brand-navy/60">
        No English voices available on this device.
      </p>
    );
  }

  return (
    <select
      aria-label="Voice"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value || null)}
      className="h-12 w-full rounded-xl border border-brand-navy/20 bg-white px-3 text-sm font-semibold text-brand-navy"
    >
      <option value="">Default voice</option>
      {voices.map((v) => (
        <option key={v.voiceURI} value={v.voiceURI}>
          {v.name} ({v.lang})
        </option>
      ))}
    </select>
  );
}
