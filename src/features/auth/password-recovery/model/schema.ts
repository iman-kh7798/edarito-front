import { z } from "zod";

const REQUIRED = "پر کردن فیلد الزامی است";

export const recoveryUsernameSchema = z.object({
  username: z.string().trim().min(1, REQUIRED),
});

export const recoveryCodeSchema = z.object({
  code: z.string().regex(/^\d{6}$/, "کد تایید باید ۶ رقم باشد"),
});

export const recoveryPasswordSchema = z
  .object({
    password: z.string().min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد"),
    confirm: z.string(),
  })
  .refine((values) => values.password === values.confirm, {
    path: ["confirm"],
    message: "رمز عبور و تکرار آن یکسان نیست",
  });
