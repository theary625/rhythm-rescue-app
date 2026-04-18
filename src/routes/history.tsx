import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Watch } from "lucide-react";
import { toast } from "sonner";
import { useApp, type HistoryEntry } from "@/lib/app-context";
import { Button } from "@/components/Button";
import { ConfirmModal } from "@/components/ConfirmModal";
import { exportCopy, exportDownload, exportShare } from "@/lib/exportSummary";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "History — MedNurse CodeAssist" },
      { name: "description", content: "Saved code sessions on this device." },
    ],
  }),
  component: HistoryScreen,
});

function fmtMmSs(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

function HistoryScreen() {
  const { history, deleteHistoryEntry } = useApp();
  const navigate = useNavigate();
  const [openId, setOpenId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const opened = history.find((h) => h.id === openId) ?? null;

  if (opened) {
    return <HistoryDetail entry={opened} onBack={() => setOpenId(null)} />;
  }

  return (
    <div
      className="min-h-screen bg-brand-softblue text-brand-navy"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <header className="flex h-14 items-center px-2">
        <Link
          to="/settings"
          aria-label="Back"
          className="inline-flex h-12 w-12 items-center justify-center rounded-full hover:bg-brand-navy/10"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-bold tracking-tight">History</h1>
      </header>

      <main className="mx-auto max-w-md space-y-3 px-5 pb-10">
        <p className="px-1 text-sm text-brand-navy/70">
          Last 5 saved sessions. Stored on this device only.
        </p>

        {history.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 text-center text-sm italic text-brand-navy/60 shadow-sm">
            No saved sessions yet.
          </div>
        ) : (
          history.map((e) => (
            <button
              key={e.id}
              type="button"
              onClick={() => setOpenId(e.id)}
              className="block w-full rounded-2xl bg-white p-4 text-left shadow-sm hover:bg-brand-navy/5"
            >
              <div className="flex items-baseline justify-between">
                <div className="flex items-center gap-1.5 text-sm font-bold text-brand-navy">
                  {e.source === "watch" && (
                    <Watch
                      className="h-3.5 w-3.5 text-brand-navy/70"
                      aria-label="Recorded on Apple Watch"
                    />
                  )}
                  <span>{new Date(e.endedAt).toLocaleString()}</span>
                </div>
                <div className="font-mono text-base font-semibold tabular-nums text-brand-navy">
                  {fmtMmSs(e.durationSec)}
                </div>
              </div>
              <div className="mt-1 text-xs text-brand-navy/70">
                {e.mode[0].toUpperCase() + e.mode.slice(1)} ·{" "}
                {e.rescuers === "two" ? "Two" : "Single"}-rescuer · Avg BPM{" "}
                {e.avgBpm ?? "—"} · Switches {e.compressorSwitches}
              </div>
            </button>
          ))
        )}
      </main>

      <ConfirmModal
        open={!!confirmDeleteId}
        headline="Delete this session?"
        body="This cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Keep"
        onConfirm={() => {
          if (confirmDeleteId) deleteHistoryEntry(confirmDeleteId);
          setConfirmDeleteId(null);
          toast("Deleted.");
        }}
        onCancel={() => setConfirmDeleteId(null)}
      />
      <span className="hidden" aria-hidden onClick={() => navigate({ to: "/settings" })} />
    </div>
  );
}

function HistoryDetail({ entry, onBack }: { entry: HistoryEntry; onBack: () => void }) {
  const { deleteHistoryEntry } = useApp();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const onCopy = async () => {
    const r = await exportCopy(entry);
    toast(r === "copied" ? "Copied to clipboard." : "Copy failed. Long-press to select.");
  };
  const onShare = async () => {
    const r = await exportShare(entry);
    if (r === "shared") return;
    toast(
      r === "copied" ? "Share unavailable. Copied instead." : "Copy failed.",
    );
  };
  const onDownload = () => exportDownload(entry);

  return (
    <div
      className="min-h-screen bg-brand-softblue text-brand-navy"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <header className="flex h-14 items-center px-2">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="inline-flex h-12 w-12 items-center justify-center rounded-full hover:bg-brand-navy/10"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold tracking-tight">Session</h1>
      </header>

      <main className="mx-auto max-w-md space-y-3 px-5 pb-32">
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
          <div className="font-mono text-5xl font-semibold tabular-nums">
            {fmtMmSs(entry.durationSec)}
          </div>
          <div className="mt-1 text-xs uppercase tracking-widest text-brand-navy/60">
            {new Date(entry.endedAt).toLocaleString()}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Stat label="Avg BPM" value={entry.avgBpm == null ? "—" : String(entry.avgBpm)} />
          <Stat
            label="In target"
            value={entry.pctInTarget == null ? "—" : `${entry.pctInTarget}%`}
          />
          <Stat label="Switches" value={String(entry.compressorSwitches)} />
          <Stat label="Rhythm checks" value={String(entry.rhythmChecks)} />
          <Stat label="Pulse checks" value={String(entry.pulseChecks)} />
          <Stat label="Epi doses" value={String(entry.epiDoses)} />
        </div>

        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="text-base font-bold">Drugs logged</div>
          <ul className="mt-3 space-y-1 text-sm">
            {entry.drugLog.length === 0 ? (
              <li className="italic text-brand-navy/60">None</li>
            ) : (
              entry.drugLog.map((d, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="font-mono tabular-nums text-brand-navy/70">
                    {fmtMmSs(d.offsetSec)}
                  </span>
                  <span className="font-semibold">{d.name}</span>
                  <span className="text-brand-navy/70">·</span>
                  <span>{d.doseDisplay}</span>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="text-base font-bold">Reversible causes considered</div>
          <p className="mt-2 text-sm">
            {entry.causesConsidered.length === 0
              ? "None."
              : entry.causesConsidered.join(", ")}
          </p>
        </section>

        {entry.notes.trim() && (
          <section className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="text-base font-bold">Notes</div>
            <p className="mt-2 whitespace-pre-wrap text-sm">{entry.notes}</p>
          </section>
        )}
      </main>

      <div
        className="fixed inset-x-0 bottom-0 border-t border-brand-navy/10 bg-brand-softblue/95 px-4 pb-5 pt-3 backdrop-blur"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)" }}
      >
        <div className="mx-auto max-w-md space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <Button variant="secondary" size="md" onClick={onCopy}>
              Copy
            </Button>
            <Button variant="secondary" size="md" onClick={onShare}>
              Share
            </Button>
            <Button variant="secondary" size="md" onClick={onDownload}>
              Download
            </Button>
          </div>
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="inline-flex h-12 w-full items-center justify-center rounded-2xl border-2 border-brand-red text-sm font-bold text-brand-red hover:bg-brand-red/10"
          >
            Delete this session
          </button>
        </div>
      </div>

      <ConfirmModal
        open={confirmDelete}
        headline="Delete this session?"
        body="This cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Keep"
        onConfirm={() => {
          deleteHistoryEntry(entry.id);
          setConfirmDelete(false);
          onBack();
        }}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-3 shadow-sm">
      <div className="text-[10px] font-bold uppercase tracking-widest text-brand-navy/60">
        {label}
      </div>
      <div className="mt-1 font-mono text-2xl font-semibold tabular-nums text-brand-navy">
        {value}
      </div>
    </div>
  );
}
