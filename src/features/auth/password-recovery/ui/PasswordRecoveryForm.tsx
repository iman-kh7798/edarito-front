import { type FormEvent } from "react";

import { Button } from "@/shared/ui/button";
import { Countdown } from "@/shared/ui/countdown";
import { BackArrowIcon, CheckIcon } from "@/shared/ui/icon";
import { IconButton } from "@/shared/ui/icon-button";
import { OtpInput } from "@/shared/ui/otp-input";
import { PasswordField } from "@/shared/ui/password-field";
import { TextField } from "@/shared/ui/text-field";

import { usePasswordRecoveryFlow } from "../model/usePasswordRecoveryFlow";

type Props = {
  /** Called from the first step's back button. */
  onBack: () => void;
  /** Called once the password has been changed. */
  onDone: () => void;
};

const HEADINGS: Record<string, string> = {
  username: "بازیابی رمز عبور",
  code: "کد تایید برای شما ارسال شده است، لطفا آنرا وارد کنید",
  password: "انتخاب رمز عبور جدید",
};

export const PasswordRecoveryForm = ({ onBack, onDone }: Props) => {
  const flow = usePasswordRecoveryFlow();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (flow.step === "username") flow.submitUsername();
    else if (flow.step === "code") flow.submitCode();
    else if (flow.step === "password") flow.submitPassword();
    else onDone();
  };

  const handleBack = () => {
    if (flow.step === "username") onBack();
    else flow.back();
  };

  if (flow.step === "done") {
    return (
      <div className="flex w-full flex-col items-center gap-6 text-center">
        <p className="text-sm text-on-gradient">
          رمز عبور شما با موفقیت تغییر کرد.
        </p>
        <Button variant="text" iconStart={<CheckIcon />} onClick={onDone}>
          ورود به حساب کاربری
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full" noValidate>
      <div className="mb-8 flex items-start justify-between gap-3">
        <h1 className="text-sm font-bold leading-6 text-on-gradient">
          {HEADINGS[flow.step]}
        </h1>
        <IconButton
          label="بازگشت"
          size="sm"
          onClick={handleBack}
          className="mt-0.5"
        >
          <BackArrowIcon />
        </IconButton>
      </div>

      {flow.step === "username" && (
        <TextField
          label="نام کاربری *"
          name="username"
          value={flow.username}
          onChange={flow.setUsername}
          error={flow.error}
          autoComplete="username"
          focusOnMount
        />
      )}

      {flow.step === "code" && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-center gap-2 text-xs text-on-gradient-muted">
            {flow.canResend ? (
              <Button variant="link" size="sm" onClick={flow.resend}>
                دریافت مجدد کد تایید
              </Button>
            ) : (
              <>
                <span>دریافت مجدد کد تایید تا</span>
                <Countdown
                  key={flow.resendNonce}
                  seconds={flow.resendSeconds}
                  onComplete={flow.markResendAvailable}
                  className="rounded-full bg-white/85 px-2 py-0.5 font-bold text-neutral-700"
                />
              </>
            )}
          </div>
          <OtpInput
            value={flow.code}
            onChange={flow.setCode}
            error={Boolean(flow.error)}
            focusOnMount
          />
          {flow.error && (
            <p className="text-center text-xs text-danger">{flow.error}</p>
          )}
        </div>
      )}

      {flow.step === "password" && (
        <div className="flex flex-col gap-5">
          <PasswordField
            label="رمز عبور جدید"
            name="new-password"
            value={flow.password}
            onChange={flow.setPassword}
            autoComplete="new-password"
            focusOnMount
          />
          <PasswordField
            label="تکرار رمز عبور جدید"
            name="confirm-password"
            value={flow.confirm}
            onChange={flow.setConfirm}
            error={flow.error}
            autoComplete="new-password"
          />
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <Button
          type="submit"
          variant="text"
          iconStart={<CheckIcon />}
          loading={flow.isBusy}
        >
          ثبت
        </Button>
      </div>
    </form>
  );
};
