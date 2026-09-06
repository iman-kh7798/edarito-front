import {
  type ClipboardEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
} from "react";

import { cn, faToEnDigits } from "@/shared/lib";

type Props = {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  focusOnMount?: boolean;
  className?: string;
};

const sanitize = (raw: string) => faToEnDigits(raw).replace(/\D/g, "");

export const OtpInput = ({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled,
  error,
  focusOnMount,
  className,
}: Props) => {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length }, (_, index) => value[index] ?? "");

  useEffect(() => {
    if (focusOnMount) refs.current[0]?.focus();
  }, [focusOnMount]);

  const commit = (next: string) => {
    const trimmed = next.slice(0, length);
    onChange(trimmed);
    if (trimmed.length === length) onComplete?.(trimmed);
  };

  const focusAt = (index: number) => {
    const clamped = Math.max(0, Math.min(length - 1, index));
    const el = refs.current[clamped];
    el?.focus();
    el?.select();
  };

  const handleChange = (index: number, raw: string) => {
    const clean = sanitize(raw);
    if (!clean) return;
    const chars = value.split("");
    chars[index] = clean[clean.length - 1];
    commit(chars.join(""));
    focusAt(index + 1);
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      const chars = value.split("");
      if (chars[index]) {
        chars[index] = "";
        commit(chars.join(""));
      } else if (index > 0) {
        chars[index - 1] = "";
        commit(chars.join(""));
        focusAt(index - 1);
      }
    }
    if (event.key === "ArrowLeft") focusAt(index + 1);
    if (event.key === "ArrowRight") focusAt(index - 1);
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const clean = sanitize(event.clipboardData.getData("text")).slice(
      0,
      length
    );
    if (!clean) return;
    commit(clean);
    focusAt(clean.length);
  };

  return (
    <div
      dir="ltr"
      className={cn("flex justify-center gap-2 sm:gap-3", className)}
    >
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            refs.current[index] = el;
          }}
          value={digit}
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          disabled={disabled}
          aria-label={`رقم ${index + 1}`}
          aria-invalid={error || undefined}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          onFocus={(event) => event.target.select()}
          className={cn(
            "h-10 w-9 appearance-none border-b-2 bg-transparent text-center text-lg font-bold text-on-gradient caret-white outline-none transition-colors",
            error
              ? "border-danger"
              : "border-on-gradient-line focus:border-on-gradient-line-strong"
          )}
        />
      ))}
    </div>
  );
};
