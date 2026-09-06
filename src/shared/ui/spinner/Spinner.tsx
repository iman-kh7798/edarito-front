import { type CSSProperties } from "react";

import { cn } from "@/shared/lib";

type SpinnerSize = "sm" | "md" | "lg";

type Props = {
  size?: SpinnerSize;
  className?: string;
  /** Accessible label, announced by screen readers. */
  label?: string;
};

const px: Record<SpinnerSize, number> = { sm: 14, md: 18, lg: 24 };

export const Spinner = ({
  size = "md",
  className,
  label = "در حال بارگذاری",
}: Props) => {
  const style: CSSProperties = { width: px[size], height: px[size] };

  return (
    <span
      role="status"
      aria-label={label}
      style={style}
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-current border-t-transparent align-[-0.125em]",
        className
      )}
    />
  );
};
