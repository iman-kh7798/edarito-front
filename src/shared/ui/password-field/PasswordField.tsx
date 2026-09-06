import { type ComponentProps, useState } from "react";

import { EyeIcon, EyeSlashIcon } from "@/shared/ui/icon";
import { IconButton } from "@/shared/ui/icon-button";
import { TextField } from "@/shared/ui/text-field";

export type PasswordFieldProps = Omit<
  ComponentProps<typeof TextField>,
  "type" | "endAdornment"
>;

/** Text field pre-wired with a show / hide toggle for password entry. */
export const PasswordField = ({
  tone = "on-gradient",
  ...props
}: PasswordFieldProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      {...props}
      tone={tone}
      type={visible ? "text" : "password"}
      endAdornment={
        <IconButton
          label={visible ? "پنهان کردن رمز عبور" : "نمایش رمز عبور"}
          tone={tone === "surface" ? "neutral" : "on-gradient"}
          size="sm"
          tabIndex={-1}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? <EyeSlashIcon /> : <EyeIcon />}
        </IconButton>
      }
    />
  );
};
