import { useEffect, useRef, useState } from "react";

import { cn, enToFaDigits } from "@/shared/lib";

type Props = {
  /** Seconds to count down from. Changing this restarts the timer. */
  seconds: number;
  onComplete?: () => void;
  /** Render digits in Persian (default) or Latin. */
  localeDigits?: boolean;
  className?: string;
};

const format = (total: number, localeDigits: boolean) => {
  const minutes = Math.floor(total / 60);
  const rest = total % 60;
  const text = `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
  return localeDigits ? enToFaDigits(text) : text;
};

export const Countdown = ({
  seconds,
  onComplete,
  localeDigits = true,
  className,
}: Props) => {
  const [left, setLeft] = useState(seconds);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    setLeft(seconds);
  }, [seconds]);

  useEffect(() => {
    if (left <= 0) {
      onCompleteRef.current?.();
      return;
    }
    const id = window.setTimeout(() => setLeft((value) => value - 1), 1000);
    return () => window.clearTimeout(id);
  }, [left]);

  return (
    <span className={cn("tabular-nums", className)} aria-live="polite">
      {format(Math.max(0, left), localeDigits)}
    </span>
  );
};
