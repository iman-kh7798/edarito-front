import { z } from "zod";

import { faToEnDigits } from "@/shared/lib";

const REQUIRED = "پر کردن فیلد الزامی است";

export const recoveryUsernameSchema = z.object({
  username: z
    .string()
    .transform((value) => faToEnDigits(value).trim())
    .pipe(z.string().min(1, REQUIRED)),
});

export const recoveryCodeSchema = z.object({
  code: z.string().regex(/^\d{6}$/, "کد تایید باید ۶ رقم باشد"),
});

// Matches the legacy panel's rule exactly ("رمز عبور باید بدون فاصله و
// شامل ۶ کاراکتر و ترکیبی از حروف و اعداد باشد"): >= 6 chars, no spaces,
// at least one letter and one digit. Single field — the legacy screen has
// no "repeat password" confirmation step.
export const recoveryPasswordSchema = z.object({
  password: z
    .string()
    .min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد")
    .regex(/^\S+$/, "رمز عبور نباید فاصله داشته باشد")
    .regex(/[A-Za-z]/, "رمز عبور باید شامل حروف باشد")
    .regex(/\d/, "رمز عبور باید شامل عدد باشد"),
});

export type UsernameStepValues = z.infer<typeof recoveryUsernameSchema>;
export type CodeStepValues = z.infer<typeof recoveryCodeSchema>;
export type PasswordStepValues = z.infer<typeof recoveryPasswordSchema>;
