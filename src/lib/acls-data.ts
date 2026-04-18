// ACLS algorithms — simplified, AHA 2020/2023 update aligned.
// For training reference. Always defer to local protocols & current AHA guidelines.

export type StepKind = "action" | "shock" | "med" | "check" | "consider" | "rosc";

export interface AlgoStep {
  kind: StepKind;
  title: string;
  detail?: string;
}

export interface AlgoBranch {
  id: string;
  label: string;
  rhythms: string[];
  shockable: boolean;
  steps: AlgoStep[];
}

export interface Algorithm {
  slug: string;
  title: string;
  short: string;
  summary: string;
  branches: AlgoBranch[];
  notes?: string[];
}

export const ARREST: Algorithm = {
  slug: "cardiac-arrest",
  title: "Adult Cardiac Arrest",
  short: "VF / pVT / Asystole / PEA",
  summary:
    "High-quality CPR (100–120/min, 5–6 cm depth, full recoil, minimize interruptions). Rhythm check every 2 minutes.",
  branches: [
    {
      id: "shockable",
      label: "Shockable",
      rhythms: ["VF", "pVT"],
      shockable: true,
      steps: [
        { kind: "action", title: "Start CPR · attach monitor / defibrillator · O₂" },
        { kind: "shock", title: "Shock", detail: "Biphasic 120–200 J (or per device); monophasic 360 J" },
        { kind: "action", title: "Resume CPR 2 min", detail: "IV/IO access" },
        { kind: "check", title: "Rhythm check" },
        { kind: "shock", title: "Shock (if still VF/pVT)" },
        { kind: "action", title: "CPR 2 min" },
        { kind: "med", title: "Epinephrine 1 mg IV/IO", detail: "Repeat every 3–5 min" },
        { kind: "consider", title: "Consider advanced airway · capnography" },
        { kind: "check", title: "Rhythm check" },
        { kind: "shock", title: "Shock (if still VF/pVT)" },
        { kind: "action", title: "CPR 2 min" },
        { kind: "med", title: "Amiodarone 300 mg IV/IO bolus", detail: "2nd dose 150 mg, OR Lidocaine 1–1.5 mg/kg" },
        { kind: "consider", title: "Treat reversible causes (H's & T's)" },
        { kind: "rosc", title: "If ROSC → Post-Cardiac Arrest Care" },
      ],
    },
    {
      id: "non-shockable",
      label: "Non-shockable",
      rhythms: ["Asystole", "PEA"],
      shockable: false,
      steps: [
        { kind: "action", title: "Start CPR · O₂ · monitor" },
        { kind: "med", title: "Epinephrine 1 mg IV/IO ASAP", detail: "Repeat every 3–5 min" },
        { kind: "action", title: "CPR 2 min · IV/IO access" },
        { kind: "consider", title: "Advanced airway · capnography" },
        { kind: "check", title: "Rhythm check every 2 min" },
        { kind: "consider", title: "Treat reversible causes (H's & T's)" },
        { kind: "rosc", title: "If ROSC → Post-Cardiac Arrest Care" },
        { kind: "rosc", title: "If shockable rhythm develops → switch branch" },
      ],
    },
  ],
  notes: [
    "H's: Hypovolemia, Hypoxia, Hydrogen ion (acidosis), Hypo/Hyperkalemia, Hypothermia",
    "T's: Tension pneumothorax, Tamponade (cardiac), Toxins, Thrombosis (pulmonary/coronary)",
  ],
};

export const BRADY: Algorithm = {
  slug: "bradycardia",
  title: "Bradycardia (with pulse)",
  short: "HR < 50 with symptoms",
  summary: "Identify & treat underlying cause. Maintain airway, O₂ if hypoxic, monitor, IV access, 12-lead ECG.",
  branches: [
    {
      id: "stable",
      label: "Adequate perfusion",
      rhythms: ["Sinus brady", "AV blocks"],
      shockable: false,
      steps: [
        { kind: "action", title: "Monitor & observe" },
        { kind: "consider", title: "Identify & treat underlying cause" },
      ],
    },
    {
      id: "unstable",
      label: "Poor perfusion",
      rhythms: ["Hypotension", "AMS", "Shock", "Chest pain", "Acute HF"],
      shockable: false,
      steps: [
        { kind: "med", title: "Atropine 1 mg IV", detail: "Repeat q3–5 min, max 3 mg" },
        { kind: "action", title: "If atropine ineffective:" },
        { kind: "action", title: "Transcutaneous pacing", detail: "OR" },
        { kind: "med", title: "Dopamine 5–20 mcg/kg/min", detail: "OR" },
        { kind: "med", title: "Epinephrine 2–10 mcg/min infusion" },
        { kind: "consider", title: "Expert consult · transvenous pacing" },
      ],
    },
  ],
};

export const TACHY: Algorithm = {
  slug: "tachycardia",
  title: "Tachycardia (with pulse)",
  short: "HR ≥ 150 typically symptomatic",
  summary: "Assess for instability: hypotension, AMS, shock, ischemic chest pain, acute HF.",
  branches: [
    {
      id: "unstable",
      label: "Unstable",
      rhythms: ["Any tachy with serious S/S"],
      shockable: true,
      steps: [
        { kind: "shock", title: "Synchronized cardioversion" },
        { kind: "action", title: "Narrow regular: 50–100 J" },
        { kind: "action", title: "Narrow irregular: 120–200 J biphasic" },
        { kind: "action", title: "Wide regular: 100 J" },
        { kind: "action", title: "Wide irregular: defibrillation dose (NOT synchronized)" },
        { kind: "consider", title: "Sedate if conscious — do NOT delay cardioversion" },
      ],
    },
    {
      id: "stable-narrow",
      label: "Stable · Narrow QRS",
      rhythms: ["SVT", "A-fib", "A-flutter"],
      shockable: false,
      steps: [
        { kind: "action", title: "Vagal maneuvers" },
        { kind: "med", title: "Adenosine 6 mg rapid IV push", detail: "2nd dose 12 mg if regular" },
        { kind: "med", title: "β-blocker or Ca-channel blocker", detail: "If irregular (A-fib/flutter)" },
        { kind: "consider", title: "Expert consultation" },
      ],
    },
    {
      id: "stable-wide",
      label: "Stable · Wide QRS",
      rhythms: ["VT", "SVT w/ aberrancy"],
      shockable: false,
      steps: [
        { kind: "med", title: "Adenosine ONLY if regular & monomorphic" },
        { kind: "med", title: "Procainamide 20–50 mg/min IV", detail: "OR" },
        { kind: "med", title: "Amiodarone 150 mg over 10 min", detail: "OR" },
        { kind: "med", title: "Sotalol 100 mg over 5 min" },
        { kind: "consider", title: "Expert consultation" },
      ],
    },
  ],
};

export const POST_ROSC: Algorithm = {
  slug: "post-rosc",
  title: "Post-Cardiac Arrest Care",
  short: "Optimize ventilation, perfusion & neuro outcome",
  summary: "Begin immediately after ROSC. Goal: complete recovery with intact neurologic function.",
  branches: [
    {
      id: "abc",
      label: "Airway · Breathing",
      rhythms: [],
      shockable: false,
      steps: [
        { kind: "action", title: "Advanced airway · waveform capnography" },
        { kind: "action", title: "SpO₂ 92–98% · PaCO₂ 35–45 mmHg" },
        { kind: "action", title: "Avoid hyperventilation (10/min start)" },
      ],
    },
    {
      id: "circ",
      label: "Circulation",
      rhythms: [],
      shockable: false,
      steps: [
        { kind: "action", title: "SBP ≥ 90 / MAP ≥ 65 mmHg" },
        { kind: "med", title: "IV bolus 1–2 L NS/LR" },
        { kind: "med", title: "Epi 0.1–0.5 mcg/kg/min · Norepi 0.1–0.5 mcg/kg/min · Dopa 5–20" },
        { kind: "action", title: "12-lead ECG · troponin" },
      ],
    },
    {
      id: "neuro",
      label: "Neuro / TTM",
      rhythms: [],
      shockable: false,
      steps: [
        { kind: "action", title: "Targeted Temperature Management 32–36 °C × 24 h" },
        { kind: "action", title: "Continuous EEG if comatose" },
        { kind: "consider", title: "Emergent PCI if STEMI or high suspicion AMI" },
        { kind: "consider", title: "ICU admission · neuro-prognostication ≥ 72 h" },
      ],
    },
  ],
};

export const ACS: Algorithm = {
  slug: "acs",
  title: "Acute Coronary Syndrome",
  short: "Suspected ACS / STEMI",
  summary: "Goal: door-to-balloon ≤ 90 min for STEMI. Door-to-needle ≤ 30 min if PCI not available.",
  branches: [
    {
      id: "initial",
      label: "Initial assessment ≤ 10 min",
      rhythms: [],
      shockable: false,
      steps: [
        { kind: "action", title: "12-lead ECG · IV access · O₂ if SpO₂ < 90%" },
        { kind: "med", title: "Aspirin 162–325 mg chewed" },
        { kind: "med", title: "Nitroglycerin SL · IV" },
        { kind: "med", title: "Morphine if pain refractory to NTG" },
        { kind: "action", title: "Targeted history · troponin · CXR" },
      ],
    },
    {
      id: "stemi",
      label: "STEMI",
      rhythms: ["ST elevation ≥ 1 mm in 2 contig leads"],
      shockable: false,
      steps: [
        { kind: "action", title: "Activate cath lab / reperfusion team" },
        { kind: "action", title: "PCI ≤ 90 min (preferred)" },
        { kind: "med", title: "Fibrinolysis if PCI > 120 min & no contraindications" },
        { kind: "med", title: "P2Y12 inhibitor · anticoagulant per protocol" },
      ],
    },
    {
      id: "nstemi",
      label: "NSTE-ACS",
      rhythms: ["ST depression / dynamic T", "Elevated troponin"],
      shockable: false,
      steps: [
        { kind: "med", title: "Antiplatelet · anticoagulant per risk score" },
        { kind: "action", title: "Risk stratify (TIMI / GRACE / HEART)" },
        { kind: "consider", title: "Early invasive strategy if high risk" },
      ],
    },
  ],
};

export const STROKE: Algorithm = {
  slug: "stroke",
  title: "Suspected Stroke",
  short: "Cincinnati / FAST · time-critical",
  summary: "Goal: door-to-CT ≤ 25 min, door-to-needle ≤ 60 min for IV alteplase eligible.",
  branches: [
    {
      id: "ed",
      label: "ED arrival ≤ 10 min",
      rhythms: [],
      shockable: false,
      steps: [
        { kind: "action", title: "ABC · O₂ if SpO₂ < 94% · IV · glucose" },
        { kind: "action", title: "Last known well time · NIHSS" },
        { kind: "action", title: "Activate stroke team · order non-contrast CT" },
      ],
    },
    {
      id: "imaging",
      label: "Imaging ≤ 25 min · read ≤ 45 min",
      rhythms: [],
      shockable: false,
      steps: [
        { kind: "check", title: "Hemorrhage on CT?" },
        { kind: "action", title: "If YES → neurosurgery / stroke team consult" },
        { kind: "action", title: "If NO → assess for fibrinolytic candidacy" },
      ],
    },
    {
      id: "treat",
      label: "Treat ≤ 60 min",
      rhythms: [],
      shockable: false,
      steps: [
        { kind: "med", title: "IV alteplase ≤ 4.5 h from onset (eligible)" },
        { kind: "consider", title: "Endovascular thrombectomy ≤ 24 h (LVO)" },
        { kind: "action", title: "BP < 185/110 before lytic; < 180/105 after" },
        { kind: "action", title: "Admit to stroke unit / ICU" },
      ],
    },
  ],
};

export const ALGORITHMS: Algorithm[] = [ARREST, BRADY, TACHY, POST_ROSC, ACS, STROKE];

export const REVERSIBLE_CAUSES = [
  { letter: "H", label: "Hypovolemia" },
  { letter: "H", label: "Hypoxia" },
  { letter: "H", label: "Hydrogen ion (acidosis)" },
  { letter: "H", label: "Hypo-/Hyperkalemia" },
  { letter: "H", label: "Hypothermia" },
  { letter: "T", label: "Tension pneumothorax" },
  { letter: "T", label: "Tamponade (cardiac)" },
  { letter: "T", label: "Toxins" },
  { letter: "T", label: "Thrombosis (pulmonary)" },
  { letter: "T", label: "Thrombosis (coronary)" },
];
