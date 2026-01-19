// src/shared/lib/validation/iran.ts
import { z } from "zod";

import { faToEnDigits, luhn, mod11NationalId, normalizeSpaces } from "./utils";

/* -----------------------------
  Zod preprocessors
------------------------------ */
export const zNormalizeString = (): z.ZodType<string> =>
  z.preprocess(
    (v) => (typeof v === "string" ? normalizeSpaces(v) : v),
    z.string()
  );

export const zIranDigits = (): z.ZodType<string> =>
  z.preprocess(
    (v) => (typeof v === "string" ? faToEnDigits(v) : v),
    z.string()
  );
/* ======================================================
  Validators
====================================================== */

/** 🇮🇷 Mobile: 09xxxxxxxxx */
export const zIranMobile = (
  message = "شماره موبایل معتبر نیست"
): z.ZodType<string> =>
  zIranDigits()
    .transform((s) => s.replace(/\s|-/g, ""))
    .refine((s) => /^09\d{9}$/.test(s), { message });

/** 🇮🇷 National ID (10 digits + mod11) */
export const zNationalId = (message = "کد ملی معتبر نیست"): z.ZodType<string> =>
  zIranDigits()
    .transform((s) => s.replace(/\s|-/g, ""))
    .refine((s) => /^\d{10}$/.test(s), { message })
    .refine((s) => !/^(\d)\1{9}$/.test(s), { message })
    .refine(mod11NationalId, { message });

/** 💳 Shetab Card (16 digits + Luhn) */
export const zShetabCard = (
  message = "شماره کارت معتبر نیست"
): z.ZodType<string> =>
  zIranDigits()
    .transform((s) => s.replace(/\s|-/g, ""))
    .refine((s) => /^\d{16}$/.test(s), { message })
    .refine(luhn, { message });

/** 🏦 Sheba (IR + 24 digits) */
export const zSheba = (message = "شماره شبا معتبر نیست"): z.ZodType<string> =>
  z
    .preprocess(
      (v) =>
        typeof v === "string"
          ? faToEnDigits(v).toUpperCase().replace(/\s|-/g, "")
          : v,
      z.string()
    )
    .refine((s) => /^IR\d{24}$/.test(s), { message });

/** 📮 Postal Code (10 digits) */
export const zPostalCode = (
  message = "کد پستی معتبر نیست"
): z.ZodType<string> =>
  zIranDigits()
    .transform((s) => s.replace(/\s|-/g, ""))
    .refine((s) => /^\d{10}$/.test(s), { message })
    .refine((s) => !/^0{10}$/.test(s), { message });

/** 📅 Jalali Date (YYYY/MM/DD) */
export const zJalaliDate = (
  message = "تاریخ شمسی معتبر نیست"
): z.ZodType<string> =>
  zIranDigits()
    .transform((s) => s.replace(/-/g, "/"))
    .refine((s) => /^\d{4}\/\d{2}\/\d{2}$/.test(s), { message })
    .refine(
      (s) => {
        const [y, m, d] = s.split("/").map(Number);
        if (y < 1200 || y > 1600) return false;
        if (m < 1 || m > 12) return false;
        if (d < 1 || d > 31) return false;
        if (m > 6 && d > 30) return false;
        if (m === 12 && d > 30) return false;
        return true;
      },
      { message }
    );

/** 📧 Email */
export const zEmail = (message = "ایمیل معتبر نیست") =>
  zNormalizeString().pipe(z.string().email(message));

/** 🔐 Strong password */
export const zStrongPassword = (
  message = "رمز عبور باید حداقل ۸ کاراکتر و شامل حرف و عدد باشد"
) =>
  zNormalizeString().pipe(
    z
      .string()
      .min(8, message)
      .refine((s) => /[A-Za-z]/.test(s) && /\d/.test(s), { message })
  );

/** 👤 Full name (no digits) */
export const zFullName = (message = "نام معتبر نیست") =>
  zNormalizeString().pipe(
    z
      .string()
      .min(2, message)
      .max(80, message)
      .refine((s) => !/\d/.test(s), { message })
  );

// USE CASE
// import { z } from "zod";
// import {
//   zIranMobile,
//   zNationalId,
//   zEmail,
//   zFullName,
//   zOptional,
// } from "@/shared/lib/validation/iran";

// export const schema = z.object({
//   fullName: zFullName(),
//   email: zEmail(),
//   mobile: zIranMobile(),
//   nationalId: zNationalId(),
//   card: zOptional(z.string()),
// });

// export type FormValues = z.infer<typeof schema>;
