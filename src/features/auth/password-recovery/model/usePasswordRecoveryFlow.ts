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
  const [confirm, updateConfirm] = useState("");
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
      { username: username.trim() },
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

  const submitCode = () => {
    const parsed = recoveryCodeSchema.safeParse({ code });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message);
      return;
    }
    clearError();
    verifyCode.mutate(
      { username: username.trim(), code },
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
    const parsed = recoveryPasswordSchema.safeParse({ password, confirm });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message);
      return;
    }
    clearError();
    resetPassword.mutate(
      { resetToken, password },
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
    confirm,
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
    setConfirm: (value: string) => {
      clearError();
      updateConfirm(value);
    },
    submitUsername,
    submitCode,
    submitPassword,
    resend,
    back,
  };
}
