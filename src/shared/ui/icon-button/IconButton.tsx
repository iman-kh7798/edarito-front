import { type ButtonHTMLAttributes, type ReactNode } from "react";

import { cn } from "@/shared/lib";
import { Spinner } from "@/shared/ui/spinner";

type IconButtonTone = "on-gradient" | "brand" | "neutral";
type IconButtonSize = "sm" | "md" | "lg";

export type IconButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "aria-label"
> & {
  /** Required accessible name for the icon-only control. */
  label: string;
  tone?: IconButtonTone;
  size?: IconButtonSize;
  loading?: boolean;
  children: ReactNode;
};

const sizeClasses: Record<IconButtonSize, string> = {
  sm: "h-7 w-7 text-[18px]",
  md: "h-9 w-9 text-[20px]",
  lg: "h-12 w-12 text-[22px]",
};

const toneClasses: Record<IconButtonTone, string> = {
  "on-gradient":
    "text-on-gradient hover:bg-white/10 focus-visible:outline-white",
  brand:
    "bg-brand-500 text-white shadow-fab hover:bg-brand-600 focus-visible:outline-brand-600",
  neutral: "text-muted hover:bg-neutral-100 focus-visible:outline-neutral-400",
};

export const IconButton = ({
  label,
  tone = "on-gradient",
  size = "md",
  loading = false,
  disabled,
  className,
  children,
  type = "button",
  ...rest
}: IconButtonProps) => (
  <button
    type={type}
    aria-label={label}
    disabled={disabled ?? loading}
    aria-busy={loading || undefined}
    className={cn(
      "inline-flex shrink-0 items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50",
      sizeClasses[size],
      toneClasses[tone],
      className
    )}
    {...rest}
  >
    {loading ? <Spinner size="sm" /> : children}
  </button>
);
