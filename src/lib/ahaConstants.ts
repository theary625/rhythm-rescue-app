// AHA-aligned CPR cadence defaults. Range: 100–120 compressions per minute.
export const BPM_MIN = 100;
export const BPM_DEFAULT = 110;
export const BPM_MAX = 120;

// Compressor switch cadence — AHA recommends rotating every ~2 minutes
// to reduce rescuer fatigue and maintain compression quality.
export const COMPRESSOR_SWITCH_INTERVAL_MS = 2 * 60 * 1000;

// Pulse check duration — AHA guidance: ≤ 10 seconds.
export const PULSE_CHECK_SECONDS = 10;

export const RATIOS = {
  adult: { single: "30:2", two: "30:2" },
  pediatric: { single: "30:2", two: "15:2" },
  infant: { single: "30:2", two: "15:2" },
} as const;

export const DEPTH_TARGETS = {
  adult: "At least 2 inches (5 cm), no more than 2.4 inches (6 cm)",
  pediatric: "About 2 inches (5 cm) — roughly one-third AP chest depth",
  infant: "About 1.5 inches (4 cm) — roughly one-third AP chest depth",
} as const;

// Epinephrine cycle — AHA: 1 mg IV/IO every 3–5 minutes during cardiac arrest.
export const EPI_CYCLE_MIN_MS = 3 * 60 * 1000;
export const EPI_CYCLE_MAX_MS = 5 * 60 * 1000;
export const EPI_CYCLE_DEFAULT_MS = 4 * 60 * 1000;

export interface DrugRef {
  name: string;
  indication: string;
  dose: string;
  interval: string;
  notes: string;
  perKgMg?: number;
  maxSingleDoseMg?: number;
  formula?: string;
  /** Optional display strings for periarrest drugs (Pass 10). */
  minSingleDose?: string;
  maxSingleDose?: string;
  max?: string;
}

export const ADULT_DRUGS: DrugRef[] = [
  {
    name: "Epinephrine",
    indication: "All cardiac arrest rhythms",
    dose: "1 mg IV/IO",
    interval: "Every 3–5 minutes",
    notes: "Give ASAP for non-shockable; after 2nd shock for shockable.",
  },
  {
    name: "Amiodarone",
    indication: "Refractory VF / pulseless VT",
    dose: "300 mg IV/IO first dose, 150 mg second dose",
    interval: "After epinephrine, between shocks",
    notes: "Alternative: Lidocaine 1–1.5 mg/kg first dose, then 0.5–0.75 mg/kg.",
  },
  {
    name: "Lidocaine",
    indication: "Refractory VF / pulseless VT (alternative to amiodarone)",
    dose: "1–1.5 mg/kg IV/IO first dose, then 0.5–0.75 mg/kg",
    interval: "May repeat every 5–10 minutes; max 3 mg/kg",
    notes: "Use when amiodarone unavailable.",
  },
];

export const PEDIATRIC_DRUGS: DrugRef[] = [
  {
    name: "Epinephrine",
    indication: "All pediatric cardiac arrest rhythms",
    dose: "0.01 mg/kg IV/IO (0.1 mL/kg of 1:10,000)",
    interval: "Every 3–5 minutes",
    perKgMg: 0.01,
    maxSingleDoseMg: 1,
    formula: "0.01 mg/kg",
    notes: "Max single dose 1 mg.",
  },
  {
    name: "Amiodarone",
    indication: "Pediatric refractory VF / pulseless VT",
    dose: "5 mg/kg IV/IO bolus",
    interval: "May repeat up to 2 times for refractory VF/pVT",
    perKgMg: 5,
    maxSingleDoseMg: 300,
    formula: "5 mg/kg",
    notes: "Max single dose 300 mg.",
  },
  {
    name: "Lidocaine",
    indication: "Pediatric refractory VF / pulseless VT (alternative)",
    dose: "1 mg/kg IV/IO loading dose",
    interval: "Then infusion 20–50 mcg/kg/min",
    perKgMg: 1,
    maxSingleDoseMg: 100,
    formula: "1 mg/kg",
    notes: "Alternative to amiodarone.",
  },
];

export const DEFIB_ENERGIES = {
  adult: {
    biphasic:
      "Manufacturer recommended (typically 120–200 J). If unknown, use 200 J.",
    monophasic: "360 J",
    subsequent: "Equal or higher than first shock per protocol.",
  },
  pediatric: {
    first: "2 J/kg",
    second: "4 J/kg",
    subsequent: "4–10 J/kg (do not exceed adult max).",
  },
} as const;

export interface ReversibleCause {
  code: "H" | "T";
  label: string;
  prompt: string;
}

export const REVERSIBLE_CAUSES: ReversibleCause[] = [
  { code: "H", label: "Hypovolemia", prompt: "Volume status? Bleeding? Fluids running?" },
  { code: "H", label: "Hypoxia", prompt: "Airway secure? Adequate ventilation? O₂ sat?" },
  { code: "H", label: "Hydrogen ion (acidosis)", prompt: "Recent ABG? Known metabolic state?" },
  { code: "H", label: "Hypo / hyperkalemia", prompt: "Recent K⁺? Renal disease? Dialysis?" },
  { code: "H", label: "Hypothermia", prompt: "Core temperature? Exposure?" },
  { code: "T", label: "Tension pneumothorax", prompt: "Breath sounds equal? Tracheal deviation?" },
  { code: "T", label: "Tamponade (cardiac)", prompt: "Distended neck veins? Muffled heart sounds?" },
  { code: "T", label: "Toxins", prompt: "Known ingestion? Med error? Reversal agent?" },
  { code: "T", label: "Thrombosis (pulmonary)", prompt: "Risk factors for PE? Recent surgery / immobility?" },
  { code: "T", label: "Thrombosis (coronary / MI)", prompt: "Recent chest pain? STEMI risk?" },
];

// ─── Pass 10: Periarrest drug references (display only) ────────────────────────

export const ADULT_PERIARREST_DRUGS: DrugRef[] = [
  {
    name: "Atropine",
    indication: "Symptomatic bradycardia",
    dose: "1 mg IV bolus",
    interval: "Every 3–5 minutes as needed",
    max: "Maximum 3 mg total",
    notes:
      "May be ineffective in heart-transplant patients. Avoid relying on atropine in 2nd-degree Type II or 3rd-degree AV block — pace early.",
  },
  {
    name: "Adenosine",
    indication: "Stable narrow-complex regular tachycardia (SVT)",
    dose: "6 mg rapid IV push, follow with 20 mL saline flush, elevate arm",
    interval: "Second dose 12 mg if no conversion",
    max: "Maximum two doses",
    notes:
      "Brief asystole expected. Have monitor and resuscitation equipment ready. Avoid in polymorphic wide-complex tachycardia.",
  },
  {
    name: "Diltiazem",
    indication: "Rate control in stable atrial fibrillation / flutter",
    dose: "15–20 mg IV over 2 minutes",
    interval: "May repeat 20–25 mg in 15 minutes if needed",
    max: "Per facility protocol",
    notes: "Avoid in WPW with pre-excited atrial fibrillation. Hypotension precaution.",
  },
  {
    name: "Procainamide",
    indication: "Stable wide-complex tachycardia (monomorphic VT)",
    dose:
      "20–50 mg/min IV until arrhythmia suppressed, hypotension, QRS widens > 50%, or 17 mg/kg given",
    interval: "Maintenance: 1–4 mg/min",
    max: "17 mg/kg loading",
    notes: "Avoid in prolonged QT or CHF.",
  },
  {
    name: "Dopamine infusion",
    indication: "Symptomatic bradycardia unresponsive to atropine; post-arrest hypotension",
    dose: "5–20 mcg/kg/min IV infusion",
    interval: "Titrate to effect",
    max: "Per facility protocol",
    notes:
      "Display only — verify infusion rate with pump and order. Cognitive aid only.",
  },
  {
    name: "Epinephrine infusion",
    indication: "Symptomatic bradycardia unresponsive to atropine; post-arrest hypotension",
    dose: "2–10 mcg/min IV infusion",
    interval: "Titrate to effect",
    max: "Per facility protocol",
    notes:
      "Different from arrest-dose epinephrine. Verify concentration and pump setup. Cognitive aid only.",
  },
];

export const PEDIATRIC_PERIARREST_DRUGS: DrugRef[] = [
  {
    name: "Atropine (pediatric)",
    indication: "Vagally mediated bradycardia or AV block",
    dose: "0.02 mg/kg IV/IO",
    interval: "May repeat once after 5 minutes",
    minSingleDose: "0.1 mg minimum (avoid paradoxical bradycardia)",
    maxSingleDose: "0.5 mg maximum single dose",
    notes: "Not first-line in hypoxia-related bradycardia — treat hypoxia first.",
  },
  {
    name: "Adenosine (pediatric)",
    indication: "Pediatric SVT with adequate perfusion",
    dose:
      "First: 0.1 mg/kg rapid IV/IO push (max 6 mg). Second: 0.2 mg/kg (max 12 mg)",
    interval: "May give second dose 1–2 minutes after first",
    notes: "Push as close to the heart as possible, follow with rapid saline flush.",
  },
  {
    name: "Procainamide (pediatric)",
    indication:
      "Pediatric wide-complex tachycardia (monomorphic VT) with pulse, expert consult",
    dose: "15 mg/kg IV/IO over 30–60 minutes",
    interval: "Single loading dose; expert consult for maintenance",
    notes: "Do not give simultaneously with amiodarone.",
  },
];
