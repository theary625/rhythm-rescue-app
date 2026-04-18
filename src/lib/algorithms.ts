import type { DrugRef } from "./ahaConstants";
import {
  ADULT_DRUGS,
  ADULT_PERIARREST_DRUGS,
  PEDIATRIC_DRUGS,
  PEDIATRIC_PERIARREST_DRUGS,
} from "./ahaConstants";
import type { PatientMode } from "./app-context";

export type AlgorithmId =
  | "cardiac-arrest"
  | "adult-bradycardia"
  | "adult-tachycardia"
  | "adult-post-arrest"
  | "pediatric-bradycardia"
  | "pediatric-tachycardia";

export type AlgorithmSection = "arrest" | "peri" | "post";

export interface AlgorithmMeta {
  id: AlgorithmId;
  shortLabel: string; // chip label
  cardTitle: string;
  description: string;
  section: AlgorithmSection;
  /** Suggested patient mode when opened from /reference. */
  preferredMode?: PatientMode;
}

export const ALGORITHMS: AlgorithmMeta[] = [
  {
    id: "cardiac-arrest",
    shortLabel: "Cardiac Arrest",
    cardTitle: "Adult Cardiac Arrest",
    description: "VF / pulseless VT, asystole, PEA. Walkthrough.",
    section: "arrest",
    preferredMode: "adult",
  },
  {
    id: "cardiac-arrest",
    shortLabel: "Cardiac Arrest",
    cardTitle: "Pediatric Cardiac Arrest",
    description: "Pediatric arrest, weight-based dosing.",
    section: "arrest",
    preferredMode: "pediatric",
  },
  {
    id: "adult-bradycardia",
    shortLabel: "Bradycardia",
    cardTitle: "Adult Bradycardia",
    description: "HR < 50 with poor perfusion. Atropine, pacing, infusions.",
    section: "peri",
    preferredMode: "adult",
  },
  {
    id: "adult-tachycardia",
    shortLabel: "Tachycardia",
    cardTitle: "Adult Tachycardia",
    description: "Stable vs unstable, narrow vs wide complex.",
    section: "peri",
    preferredMode: "adult",
  },
  {
    id: "pediatric-bradycardia",
    shortLabel: "Bradycardia",
    cardTitle: "Pediatric Bradycardia",
    description: "HR < 60 with poor perfusion despite oxygenation.",
    section: "peri",
    preferredMode: "pediatric",
  },
  {
    id: "pediatric-tachycardia",
    shortLabel: "Tachycardia",
    cardTitle: "Pediatric Tachycardia",
    description: "Stable vs unstable, narrow vs wide complex.",
    section: "peri",
    preferredMode: "pediatric",
  },
  {
    id: "adult-post-arrest",
    shortLabel: "Post-Arrest",
    cardTitle: "Adult Post-Cardiac-Arrest Care",
    description: "Oxygenation, hemodynamics, TTM, ECG, cause.",
    section: "post",
    preferredMode: "adult",
  },
];

/** Chips shown in the overlay header. */
export const CHIP_ALGORITHMS: { id: AlgorithmId; label: string }[] = [
  { id: "cardiac-arrest", label: "Cardiac Arrest" },
  { id: "adult-bradycardia", label: "Bradycardia" },
  { id: "adult-tachycardia", label: "Tachycardia" },
  { id: "adult-post-arrest", label: "Post-Arrest" },
];

/** Resolve the appropriate chip id for a given algorithm + mode. */
export function chipIdFor(algo: AlgorithmId, mode: PatientMode): AlgorithmId {
  if (algo === "pediatric-bradycardia") return "adult-bradycardia";
  if (algo === "pediatric-tachycardia") return "adult-tachycardia";
  return algo;
  // mode reserved for future divergence
  void mode;
}

/** Resolve the actual algorithm id rendered for a given chip + mode. */
export function algoFromChip(chip: AlgorithmId, mode: PatientMode): AlgorithmId {
  if (chip === "adult-bradycardia" && mode !== "adult") return "pediatric-bradycardia";
  if (chip === "adult-tachycardia" && mode !== "adult") return "pediatric-tachycardia";
  return chip;
}

/** Drug set displayed in the Drugs tab for a given algorithm + mode. */
export function drugsForAlgorithm(algo: AlgorithmId, mode: PatientMode): DrugRef[] {
  if (algo === "cardiac-arrest") {
    return mode === "adult" ? ADULT_DRUGS : PEDIATRIC_DRUGS;
  }
  if (algo === "pediatric-bradycardia" || algo === "pediatric-tachycardia") {
    return PEDIATRIC_PERIARREST_DRUGS;
  }
  // adult peri/post
  return mode === "adult" ? ADULT_PERIARREST_DRUGS : PEDIATRIC_PERIARREST_DRUGS;
}

export const DEFAULT_FOOTER =
  "AHA ACLS reference. Cognitive aid only. Follow your code team and orders.";

export const POST_ARREST_FOOTER =
  "Post-arrest care is unit- and protocol-specific. This is reference. Defer to your team and your facility's protocol.";
