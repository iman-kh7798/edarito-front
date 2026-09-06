import { useState } from "react";

import { passwordStepSchema, usernameStepSchema } from "./schema";
import { useLoginMutation } from "./useLoginMutation";

export type LoginStep = "username" | "password";

/**
 * Drives the two-step login screen (username -> password) and owns the call to
 * the login mutation. UI components stay presentational.
 */
export function useLoginFlow() {
  const mutation = useLoginMutation();

  const [step, setStep] = useState<LoginStep>("username");
  const [username, updateUsername] = useState("");
  const [password, updatePassword] = useState("");
  const [usernameError, setUsernameError] = useState<string>();
  const [passwordError, setPasswordError] = useState<string>();
  const [formError, setFormError] = useState<string>();

  const setUsername = (value: string) => {
    updateUsername(value);
    setUsernameError(undefined);
  };

  const setPassword = (value: string) => {
    updatePassword(value);
    setPasswordError(undefined);
    setFormError(undefined);
  };

  const submitUsername = () => {
    const parsed = usernameStepSchema.safeParse({ username });
    if (!parsed.success) {
      setUsernameError(parsed.error.issues[0]?.message);
      return;
    }
    setUsernameError(undefined);
    setStep("password");
  };

  const submitPassword = () => {
    const parsed = passwordStepSchema.safeParse({ password });
    if (!parsed.success) {
      setPasswordError(parsed.error.issues[0]?.message);
      return;
    }
    setPasswordError(undefined);
    setFormError(undefined);
    mutation.mutate(
      { username: username.trim(), password },
      { onError: () => setFormError("نام کاربری یا رمز عبور نادرست است") }
    );
  };

  const back = () => {
    setStep("username");
    updatePassword("");
    setPasswordError(undefined);
    setFormError(undefined);
  };

  return {
    step,
    username,
    password,
    usernameError,
    passwordError,
    formError,
    isSubmitting: mutation.isPending,
    setUsername,
    setPassword,
    submitUsername,
    submitPassword,
    back,
  };
}
