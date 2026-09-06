import {
  type InputHTMLAttributes,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { cn } from "@/shared/lib";

type TextFieldTone = "on-gradient" | "surface";

export type TextFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value" | "id" | "autoFocus"
> & {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  tone?: TextFieldTone;
  endAdornment?: ReactNode;
  id?: string;
  /** Focus the input on mount. */
  focusOnMount?: boolean;
};

const tones = {
  "on-gradient": {
    input: "text-on-gradient caret-white",
    labelIdle: "text-on-gradient-faint",
    labelFloat: "text-on-gradient-muted",
    line: "border-on-gradient-line",
    lineFocus: "border-on-gradient-line-strong",
    message: "text-on-gradient-muted",
  },
  surface: {
    input: "text-fg caret-current",
    labelIdle: "text-muted",
    labelFloat: "text-muted",
    line: "border-border",
    lineFocus: "border-primary",
    message: "text-muted",
  },
} as const;

export const TextField = ({
  label,
  value,
  onChange,
  error,
  hint,
  tone = "on-gradient",
  endAdornment,
  id,
  className,
  focusOnMount,
  disabled,
  onFocus,
  onBlur,
  ...rest
}: TextFieldProps) => {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const messageId = `${fieldId}-message`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  const t = tones[tone];
  const message = error ?? hint;
  const floated = focused || value.length > 0;

  useEffect(() => {
    if (focusOnMount) inputRef.current?.focus();
  }, [focusOnMount]);

  return (
    <div className={cn("w-full", disabled && "opacity-60", className)}>
      <div
        className={cn(
          "relative border-b transition-colors",
          error ? "border-danger" : focused ? t.lineFocus : t.line
        )}
      >
        <label
          htmlFor={fieldId}
          className={cn(
            "pointer-events-none absolute right-0 origin-right transition-all duration-200",
            floated
              ? cn(
                  "top-0 -translate-y-3 text-xs",
                  error ? "text-danger" : t.labelFloat
                )
              : cn("top-1/2 -translate-y-1/2 text-sm", t.labelIdle)
          )}
        >
          {label}
        </label>

        <input
          ref={inputRef}
          id={fieldId}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className={cn(
            "w-full appearance-none bg-transparent pt-5 pb-2 text-sm leading-6 outline-none",
            endAdornment ? "pl-8" : "",
            t.input
          )}
          {...rest}
        />

        {endAdornment && (
          <div className="absolute bottom-1 left-0 flex items-center">
            {endAdornment}
          </div>
        )}
      </div>

      {message && (
        <p
          id={messageId}
          className={cn("mt-1.5 text-xs", error ? "text-danger" : t.message)}
        >
          {message}
        </p>
      )}
    </div>
  );
};
