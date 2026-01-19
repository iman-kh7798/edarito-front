// src/shared/lib/date/convert.ts
import DateObject from "react-date-object";
import gregorian from "react-date-object/calendars/gregorian";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

import type { DateInput } from "./types";

/**
 * ورودی: ISO | Date | timestamp(ms)
 * خروجی: DateObject شمسی
 */
function toJalaliDateObject(value: DateInput) {
  if (!value) return null;

  const date = typeof value === "number" ? new Date(value) : value;

  return new DateObject(date).convert(persian).setLocale(persian_fa);
}

/**
 * شمسی → میلادی (ISO)
 * input: DatePicker value | string | Date
 */
export function jalaliToISO(value: string): string | null {
  if (!value) return null;

  return new DateObject({
    date: value,
    calendar: persian,
    locale: persian_fa,
  })
    .convert(gregorian)
    .toDate()
    .toISOString();
}

/**
 * میلادی → شمسی (DateObject مناسب DatePicker)
 */
export function gregorianToJalali(value: string) {
  if (!value) return null;

  return new DateObject({
    date: value,
    calendar: gregorian,
  })
    .convert(persian)
    .setLocale(persian_fa);
}

/**
 * فقط ساعت (مثلا 09:05 یا 09:05:12)
 */
export function formatTime(value: DateInput, withSeconds = false) {
  const d = toJalaliDateObject(value);
  if (!d) return "-";

  const hh = String(d.hour).padStart(2, "0");
  const mm = String(d.minute).padStart(2, "0");
  const ss = String(d.second).padStart(2, "0");

  return withSeconds ? `${hh}:${mm}:${ss}` : `${hh}:${mm}`;
}

/**
 * فقط تاریخ شمسی (مثلا ۱۴۰۳/۱۰/۰۹)
 */
export function formatJalaliDate(value: DateInput, format = "YYYY/MM/DD") {
  const d = toJalaliDateObject(value);
  return d ? d.format(format) : "-";
}

/**
 * تاریخ + ساعت شمسی (مثلا ۱۴۰۳/۱۰/۰۹ - 09:05)
 */
export function formatJalaliDateTime(
  value: DateInput,
  opts?: { dateFormat?: string; withSeconds?: boolean }
) {
  const date = formatJalaliDate(value, opts?.dateFormat ?? "YYYY/MM/DD");
  const time = formatTime(value, opts?.withSeconds ?? false);
  return `${date} - ${time}`;
}
