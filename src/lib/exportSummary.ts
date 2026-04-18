import type { HistoryEntry, PatientMode, RescuerCount } from "./app-context";
import { REVERSIBLE_CAUSES } from "./ahaConstants";

function fmtMmSs(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function modeLabel(m: PatientMode) {
  return m[0].toUpperCase() + m.slice(1);
}

function rescuerLabel(r: RescuerCount) {
  return r === "two" ? "Two" : "Single";
}

export function buildSummary(entry: HistoryEntry): string {
  const date = new Date(entry.endedAt);
  const generated = date.toLocaleString();

  const drugLines = entry.drugLog.length
    ? entry.drugLog
        .map((d) => `  ${fmtMmSs(d.offsetSec)} · ${d.name} · ${d.doseDisplay}`)
        .join("\n")
    : "  None";

  const causesLine = entry.causesConsidered.length
    ? entry.causesConsidered.join(", ")
    : "None";

  const avg = entry.avgBpm == null ? "—" : String(entry.avgBpm);
  const pct = entry.pctInTarget == null ? "—" : `${entry.pctInTarget}%`;
  const notes = entry.notes.trim() || "None";

  return [
    "MedNurse CodeAssist — Code Summary",
    `Generated: ${generated}`,
    "",
    `Mode: ${modeLabel(entry.mode)} · ${rescuerLabel(entry.rescuers)}-rescuer`,
    `Total code time: ${fmtMmSs(entry.durationSec)}`,
    "",
    "Compression metrics",
    `  Average BPM: ${avg}`,
    `  Time in target (100–120 BPM): ${pct}`,
    `  Compressor switches acknowledged: ${entry.compressorSwitches}`,
    "",
    "Code events",
    `  Rhythm checks: ${entry.rhythmChecks}`,
    `  Pulse checks: ${entry.pulseChecks}`,
    `  Epinephrine doses logged: ${entry.epiDoses}`,
    "",
    "Drugs logged",
    drugLines,
    "",
    "Reversible causes considered",
    `  ${entry.causesConsidered.length} of ${REVERSIBLE_CAUSES.length}`,
    `  Considered: ${causesLine}`,
    "",
    "Reflection notes",
    `  ${notes.replace(/\n/g, "\n  ")}`,
    "",
    "—",
    "This is a training and self-reflection summary.",
    "Not a clinical record. Not for documentation.",
    "",
  ].join("\n");
}

export function summaryFilename(endedAt: number): string {
  const d = new Date(endedAt);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `MedNurseCodeSummary_${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}.txt`;
}

export async function exportCopy(entry: HistoryEntry): Promise<"copied" | "failed"> {
  const text = buildSummary(entry);
  try {
    await navigator.clipboard.writeText(text);
    return "copied";
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok ? "copied" : "failed";
    } catch {
      return "failed";
    }
  }
}

export async function exportShare(
  entry: HistoryEntry,
): Promise<"shared" | "copied" | "failed"> {
  const text = buildSummary(entry);
  const nav = navigator as Navigator & {
    share?: (data: { title?: string; text?: string }) => Promise<void>;
  };
  if (typeof nav.share === "function") {
    try {
      await nav.share({ title: "MedNurse CodeAssist — Code Summary", text });
      return "shared";
    } catch {
      // user canceled or share failed; fall through to copy
    }
  }
  const r = await exportCopy(entry);
  return r === "copied" ? "copied" : "failed";
}

export function exportDownload(entry: HistoryEntry): void {
  const text = buildSummary(entry);
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = summaryFilename(entry.endedAt);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
