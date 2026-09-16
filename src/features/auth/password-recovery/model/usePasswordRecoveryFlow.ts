import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import {
  requestResetCodeApi,
  resetPasswordApi,
  verifyResetCodeApi,
} from "../api/passwordRecovery";

import {
  recoveryCodeSchema,
  recoveryPasswordSchema,
  recoveryUsernameSchema,
} from "./schema";

export type RecoveryStep = "username" | "code" | "password" | "done";

// The legacy panel's forgetPass endpoint returns `remind` (seconds) here;
// 180 is a reasonable default while the backend endpoint doesn't exist yet
// (see docs/backend-needs.md) and requestCode's onError can't read a real one.
const RESEND_SECONDS = 180;

/**
 * Drives the password-recovery screen: username -> verification code -> new
 * password -> done. Each network step degrades gracefully so the UI can be
 * walked through without a backend.
 */
export function usePasswordRecoveryFlow() {
  const [step, setStep] = useState<RecoveryStep>("username");
  const [username, updateUsername] = useState("");
  const [code, updateCode] = useState("");
  const [password, updatePassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [resendSeconds, setResendSeconds] = useState(RESEND_SECONDS);
  const [resendNonce, setResendNonce] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState<string>();

  const restartTimer = (seconds: number) => {
    setResendSeconds(seconds);
    setResendNonce((value) => value + 1);
    setCanResend(false);
  };

  const requestCode = useMutation({ mutationFn: requestResetCodeApi });
  const verifyCode = useMutation({ mutationFn: verifyResetCodeApi });
  const resetPassword = useMutation({ mutationFn: resetPasswordApi });

  const clearError = () => setError(undefined);

  const submitUsername = () => {
    const parsed = recoveryUsernameSchema.safeParse({ username });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message);
      return;
    }
    clearError();
    requestCode.mutate(
      { username: parsed.data.username },
      {
        onSuccess: (response) => {
          restartTimer(response.data?.retryAfterSeconds ?? RESEND_SECONDS);
          setStep("code");
        },
        onError: () => {
          restartTimer(RESEND_SECONDS);
          setStep("code");
        },
      }
    );
  };

  const resend = () => {
    restartTimer(RESEND_SECONDS);
    requestCode.mutate({ username: username.trim() });
  };

  const submitCode = (value = code) => {
    const parsed = recoveryCodeSchema.safeParse({ code: value });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message);
      return;
    }
    clearError();
    verifyCode.mutate(
      { username: username.trim(), code: parsed.data.code },
      {
        onSuccess: (response) => {
          setResetToken(response.data?.resetToken ?? "");
          setStep("password");
        },
        onError: () => setError("کد تایید نادرست است"),
      }
    );
  };

  const submitPassword = () => {
    const parsed = recoveryPasswordSchema.safeParse({ password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message);
      return;
    }
    clearError();
    resetPassword.mutate(
      { resetToken, password: parsed.data.password },
      {
        onSuccess: () => setStep("done"),
        onError: () => setError("تغییر رمز عبور انجام نشد"),
      }
    );
  };

  const back = () => {
    clearError();
    setStep((current) => (current === "password" ? "code" : "username"));
  };

  return {
    step,
    username,
    code,
    password,
    error,
    resendSeconds,
    resendNonce,
    canResend,
    markResendAvailable: () => setCanResend(true),
    isBusy:
      requestCode.isPending || verifyCode.isPending || resetPassword.isPending,
    setUsername: (value: string) => {
      clearError();
      updateUsername(value);
    },
    setCode: (value: string) => {
      clearError();
      updateCode(value);
    },
    setPassword: (value: string) => {
      clearError();
      updatePassword(value);
    },
    submitUsername,
    // OTP boxes auto-submit as soon as the 6th digit is entered (matches
    // the legacy panel); the manual "ثبت" button just re-submits the
    // current value, e.g. after a paste that didn't trigger onComplete.
    submitCode: () => submitCode(),
    onCodeComplete: (value: string) => submitCode(value),
    submitPassword,
    resend,
    back,
  };
}
