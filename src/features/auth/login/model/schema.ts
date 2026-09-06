import { z } from "zod";

import { faToEnDigits } from "@/shared/lib";

const REQUIRED = "پر کردن فیلد الزامی است";

export const usernameStepSchema = z.object({
  username: z
    .string()
    .transform((value) => faToEnDigits(value).trim())
    .pipe(
      z
        .string()
        .min(1, REQUIRED)
        .regex(/^\d{1,10}$/, "نام کاربری باید عددی و حداکثر ۱۰ رقم باشد")
    ),
});

export const passwordStepSchema = z.object({
  password: z.string().min(1, REQUIRED),
});

export type UsernameStepValues = z.infer<typeof usernameStepSchema>;
export type PasswordStepValues = z.infer<typeof passwordStepSchema>;
