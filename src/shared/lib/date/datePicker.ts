import DateObject from "react-date-object";
import gregorian from "react-date-object/calendars/gregorian";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

import type { DateInput } from "./types";

/**
 * تبدیل value دیت‌پیکر به ISO string
 */
export function pickerToISO(value: DateInput): string | null {
  if (!value) return null;

  return new DateObject(value).convert(gregorian).toDate().toISOString();
}

/**
 * تبدیل range picker به ISO
 */
export function pickerRangeToISO(range: DateInput[]): {
  from: string | null;
  to: string | null;
} {
  if (!range || range.length !== 2) {
    return { from: null, to: null };
  }

  return {
    from: pickerToISO(range[0]),
    to: pickerToISO(range[1]),
  };
}

/**
 * تبدیل multiple picker به ISO[]
 */
export function pickerMultipleToISO(values: DateInput[]): string[] {
  if (!Array.isArray(values)) return [];
  return values.map(pickerToISO).filter(Boolean) as string[];
}

/**
 * مقدار اولیه برای DatePicker از API
 */
export function apiDateToPicker(value?: string | null) {
  if (!value) return null;

  return new DateObject(value).convert(persian).setLocale(persian_fa);
}
