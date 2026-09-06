import { type ButtonHTMLAttributes, type ReactNode } from "react";

import { cn } from "@/shared/lib";
import { Spinner } from "@/shared/ui/spinner";

type ButtonVariant = "solid" | "text" | "link";
type ButtonTone = "brand" | "on-gradient" | "neutral";
type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  tone?: ButtonTone;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
};

const base =
  "inline-flex select-none items-center justify-center gap-2 font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50";

const textSize: Record<ButtonSize, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

const solidSize: Record<ButtonSize, string> = {
  sm: "h-9 rounded-md px-3 text-xs",
  md: "h-10 rounded-md px-4 text-sm",
  lg: "h-12 rounded-lg px-6 text-base",
};

const solidTone: Record<ButtonTone, string> = {
  brand:
    "bg-brand-500 text-white hover:bg-brand-600 focus-visible:outline-brand-600",
  neutral:
    "bg-neutral-800 text-white hover:bg-neutral-700 focus-visible:outline-neutral-700",
  "on-gradient":
    "bg-white text-brand-600 hover:bg-white/90 focus-visible:outline-white",
};

const ghostTone: Record<ButtonTone, string> = {
  brand: "text-brand-600 hover:text-brand-700 focus-visible:outline-brand-600",
  neutral: "text-fg hover:text-muted focus-visible:outline-neutral-400",
  "on-gradient":
    "text-on-gradient hover:text-on-gradient-muted focus-visible:outline-white",
};

export const Button = ({
  variant = "text",
  tone = "on-gradient",
  size = "md",
  loading = false,
  fullWidth = false,
  iconStart,
  iconEnd,
  disabled,
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) => {
  const classes = cn(
    base,
    fullWidth && "w-full",
    variant === "solid" && cn(solidSize[size], solidTone[tone]),
    variant === "text" &&
      cn(textSize[size], "bg-transparent px-0", ghostTone[tone]),
    variant === "link" &&
      cn(
        textSize[size],
        "bg-transparent px-0 underline-offset-4 hover:underline",
        ghostTone[tone]
      ),
    className
  );

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled ?? loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <Spinner size={size === "lg" ? "md" : "sm"} /> : iconStart}
      {children}
      {iconEnd}
    </button>
  );
};
