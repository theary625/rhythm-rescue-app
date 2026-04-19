import logoUrl from "@/assets/mednurse-logo.png";

type Variant = "full" | "icon";
type Tone = "light" | "dark";

interface Props {
  variant?: Variant;
  tone?: Tone;
  className?: string;
}

/**
 * MedNurse brand logo. Renders the official artwork.
 * `variant` and `tone` are accepted for API compatibility; the artwork is
 * pre-rendered so tone has no effect. For icon-only contexts we crop to the
 * heart mark via object-fit.
 */
export function MedNurseLogo({ variant = "full", className }: Props) {
  if (variant === "icon") {
    return (
      <span
        className={className}
        style={{
          display: "inline-block",
          aspectRatio: "1 / 1",
          backgroundImage: `url(${logoUrl})`,
          backgroundSize: "auto 100%",
          backgroundPosition: "left center",
          backgroundRepeat: "no-repeat",
        }}
        role="img"
        aria-label="MedNurse"
      />
    );
  }

  return (
    <img
      src={logoUrl}
      alt="MedNurse"
      className={className}
      style={{ objectFit: "contain", height: "100%", width: "auto" }}
    />
  );
}
