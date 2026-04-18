type Variant = "full" | "icon";
type Tone = "light" | "dark";

interface Props {
  variant?: Variant;
  tone?: Tone;
  className?: string;
}

export function MedNurseLogo({ variant = "full", tone = "light", className }: Props) {
  const fill = tone === "light" ? "#FFFFFF" : "#1A2744";

  if (variant === "icon") {
    return (
      <svg
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="MedNurse"
      >
        <rect x="14" y="4" width="4" height="24" fill={fill} rx="1" />
        <rect x="4" y="14" width="24" height="4" fill={fill} rx="1" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 200 32"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="MedNurse"
    >
      <rect x="2" y="10" width="3" height="12" fill="#E63946" rx="1" />
      <rect x="0" y="14" width="7" height="4" fill="#E63946" rx="1" />
      <text
        x="14"
        y="22"
        fill={fill}
        fontFamily="Inter, sans-serif"
        fontWeight="800"
        fontSize="18"
        letterSpacing="2"
      >
        MEDNURSE
      </text>
    </svg>
  );
}
