import { type FormEvent } from "react";

import { Button } from "@/shared/ui/button";
import { BackArrowIcon, ChevronRightIcon } from "@/shared/ui/icon";
import { IconButton } from "@/shared/ui/icon-button";
import { PasswordField } from "@/shared/ui/password-field";
import { TextField } from "@/shared/ui/text-field";

import { useLoginFlow } from "../model/useLoginFlow";

type Props = {
  onForgotPassword: () => void;
};

export const LoginForm = ({ onForgotPassword }: Props) => {
  const flow = useLoginFlow();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (flow.step === "username") flow.submitUsername();
    else flow.submitPassword();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full" noValidate>
      <div className="flex items-start gap-3">
        {flow.step === "password" && (
          <IconButton
            label="بازگشت"
            size="sm"
            onClick={flow.back}
            className="mt-4"
          >
            <BackArrowIcon />
          </IconButton>
        )}

        <div className="flex-1">
          {flow.step === "username" ? (
            <TextField
              label="نام کاربری"
              name="username"
              value={flow.username}
              onChange={flow.setUsername}
              error={flow.usernameError}
              inputMode="numeric"
              autoComplete="username"
              maxLength={10}
              focusOnMount
            />
          ) : (
            <PasswordField
              label="رمز عبور"
              name="password"
              value={flow.password}
              onChange={flow.setPassword}
              error={flow.passwordError ?? flow.formError}
              autoComplete="current-password"
              focusOnMount
            />
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <Button variant="link" onClick={onForgotPassword}>
          رمز عبور خود را فراموش کرده ام!
        </Button>
        <IconButton type="submit" label="ادامه" loading={flow.isSubmitting}>
          <ChevronRightIcon />
        </IconButton>
      </div>
    </form>
  );
};
