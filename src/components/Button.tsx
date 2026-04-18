import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "lg" | "md";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-red text-brand-white hover:brightness-110 active:brightness-95",
  secondary:
    "border-2 border-brand-accent bg-transparent text-brand-white hover:bg-brand-accent/20",
  ghost: "bg-transparent text-brand-white hover:bg-white/10",
};

const sizes: Record<Size, string> = {
  lg: "h-16 px-6 text-lg",
  md: "h-14 px-5 text-base",
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ variant = "primary", size = "md", fullWidth, className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-2xl font-bold tracking-tight",
        "transition-all duration-150 ease-out active:scale-[0.97]",
        "disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";
