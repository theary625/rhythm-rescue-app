import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/Button";
import { DebriefStatCard } from "@/components/DebriefStatCard";
import { DrugLogList } from "@/components/DrugLogList";
import { CausesGrid } from "@/components/CausesGrid";
import { MedNurseLogo } from "@/brand/MedNurseLogo";
import { useApp } from "@/lib/app-context";
import { REVERSIBLE_CAUSES } from "@/lib/ahaConstants";
import { exportCopy, exportDownload, exportShare } from "@/lib/exportSummary";
import type { HistoryEntry } from "@/lib/app-context";

export const Route = createFileRoute("/debrief")({
  head: () => ({
    meta: [
      { title: "Code summary — MedNurse CodeAssist" },
      { name: "description", content: "Code session summary." },
    ],
  }),
  component: DebriefScreen,
});

function fmtMmSs(totalSec: number) {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function DebriefScreen() {
  const navigate = useNavigate();
  const { code, patientMode, rescuers, saveToHistory } = useApp();
  const [notes, setNotes] = useState("");
  const [savedEntry, setSavedEntry] = useState<HistoryEntry | null>(null);
  const startedAtRef = useRef<number>(code.startedAt ?? Date.now());

  const durationSec = Math.round(code.finalElapsedMs / 1000);

  const { avgBpm, pctInTarget } = useMemo(() => {
    const beats = code.beatHistory;
    if (!beats.length) return { avgBpm: null as number | null, pctInTarget: null as number | null };
    const avg = Math.round(beats.reduce((a, b) => a + b, 0) / beats.length);
    const pct = Math.round(
      (100 * beats.filter((b) => b >= 100 && b <= 120).length) / beats.length,
    );
    return { avgBpm: avg, pctInTarget: pct };
  }, [code.beatHistory]);

  // build a "preview" entry used for export before save
  const previewEntry: HistoryEntry = useMemo(() => {
    const startedAt = startedAtRef.current;
    return {
      id: "preview",
      endedAt: startedAt + code.finalElapsedMs,
      durationSec,
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
  }, [code, durationSec, patientMode, rescuers, avgBpm, pctInTarget, notes]);

  const exportEntry = savedEntry ?? previewEntry;

  const onCopy = async () => {
    const r = await exportCopy(exportEntry);
    toast(r === "copied" ? "Copied to clipboard." : "Copy failed. Long-press to select.");
  };
  const onShare = async () => {
    const r = await exportShare(exportEntry);
    if (r === "shared") return;
    toast(
      r === "copied"
        ? "Share unavailable. Copied instead."
        : "Copy failed. Long-press to select.",
    );
  };
  const onDownload = () => exportDownload(exportEntry);

  const onSave = () => {
    const entry = saveToHistory(notes);
    setSavedEntry(entry);
    toast("Saved to history.");
    setTimeout(() => navigate({ to: "/" }), 400);
  };

  const considered = code.causesConsidered.length;
  const totalCauses = REVERSIBLE_CAUSES.length;

  // Empty-state safety: if user lands here without a code, show minimal view
  const hasData = code.finalElapsedMs > 0 || savedEntry !== null;

  // Prevent edit after save
  useEffect(() => {
    if (savedEntry) setNotes(savedEntry.notes);
  }, [savedEntry]);

  const counter = `${notes.length}/1000`;

  return (
    <div
      className="min-h-screen bg-brand-softblue text-brand-navy"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <header className="sticky top-0 z-10 flex h-14 items-center justify-between bg-brand-softblue/95 px-4 backdrop-blur">
        <MedNurseLogo variant="full" tone="dark" className="h-5 w-auto" />
        <h1 className="text-base font-bold tracking-tight">Code summary.</h1>
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          className="inline-flex h-12 min-w-12 items-center justify-center rounded-full px-3 text-sm font-bold text-brand-navy hover:bg-brand-navy/10"
        >
          Done
        </button>
      </header>

      <main className="mx-auto max-w-md space-y-4 px-4 pb-32 pt-4">
        <section className="rounded-2xl bg-white p-6 text-center shadow-sm">
          <div className="font-mono font-semibold tabular-nums text-6xl leading-none text-brand-navy">
            {fmtMmSs(durationSec)}
          </div>
          <div className="mt-2 text-xs font-bold uppercase tracking-widest text-brand-navy/60">
            Total code time.
          </div>
        </section>

        <section className="grid grid-cols-2 gap-2">
          <DebriefStatCard
            label="BPM target"
            value={pctInTarget == null ? "—" : `${pctInTarget}%`}
            subLabel="100–120 BPM"
          />
          <DebriefStatCard label="Avg BPM" value={avgBpm == null ? "—" : String(avgBpm)} />
          <DebriefStatCard
            label="Compressor switches"
            value={String(code.compressorSwitchCount)}
            subLabel="acknowledged"
          />
          <DebriefStatCard label="Rhythm checks" value={String(code.rhythmCheckCount)} />
          <DebriefStatCard label="Pulse checks" value={String(code.pulseChecksCount)} />
          <DebriefStatCard label="Epi doses logged" value={String(code.epiDosesGiven)} />
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="text-base font-bold text-brand-navy">Drugs logged</div>
          <div className="mt-3">
            <DrugLogList rows={previewEntry.drugLog} />
          </div>
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="text-base font-bold text-brand-navy">Reversible causes considered</div>
          <div className="mt-3">
            <CausesGrid considered={code.causesConsidered} />
          </div>
          <div className="mt-3 text-xs text-brand-navy/60">
            {considered} of {totalCauses} considered.
          </div>
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="text-base font-bold text-brand-navy">Notes for your reflection</div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value.slice(0, 1000))}
            disabled={!!savedEntry}
            placeholder="What went well? What would you change next time? (Optional. Stays on your device.)"
            rows={4}
            className="mt-3 w-full rounded-xl border border-brand-navy/15 bg-brand-softblue p-3 text-sm text-brand-navy outline-none focus:border-brand-red disabled:opacity-70"
          />
          <div className="mt-1 flex items-center justify-between text-xs text-brand-navy/60">
            <span>Do not include any patient identifiers. This stays on your device.</span>
            <span className="font-mono tabular-nums">{counter}</span>
          </div>
        </section>

        {!hasData && (
          <p className="text-center text-sm italic text-brand-navy/60">
            No code data to summarize.
          </p>
        )}

        <p className="pt-2 text-center text-[10px] text-brand-navy/50">
          Cognitive aid. Not a clinical record. Not for documentation.
        </p>
      </main>

      <div
        className="fixed inset-x-0 bottom-0 z-10 border-t border-brand-navy/10 bg-brand-softblue/95 px-4 pb-5 pt-3 backdrop-blur"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)" }}
      >
        <div className="mx-auto max-w-md space-y-2">
          {!savedEntry && hasData && (
            <Button variant="primary" size="md" fullWidth onClick={onSave}>
              Save to history
            </Button>
          )}
          <div className="grid grid-cols-3 gap-2">
            <Button variant="secondary" size="md" onClick={onCopy}>
              Copy summary
            </Button>
            <Button variant="secondary" size="md" onClick={onShare}>
              Share
            </Button>
            <Button variant="secondary" size="md" onClick={onDownload}>
              Download .txt
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
