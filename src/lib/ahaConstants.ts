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
