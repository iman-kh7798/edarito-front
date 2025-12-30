// اگر دیتا از بک‌اند با Z میاد (UTC)، این helper دقیقاً به timezone انتخابی تبدیلش می‌کنه و نمایش درست می‌شه.

import type { DateInput } from "./types";

function toDate(value: DateInput): Date | null {
  if (!value) return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  if (typeof value === "number") {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }
  // string
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * تاریخ شمسی (timezone-safe)
 * مثال خروجی: ۱۴۰۴/۱۰/۰۹
 */
export function formatJalaliDateTZ(
  value: DateInput,
  opts?: {
    timeZone?: string; // e.g. "Asia/Tehran" | "Asia/Baku"
    withWeekday?: boolean;
  }
) {
  const d = toDate(value);
  if (!d) return "-";

  const timeZone = opts?.timeZone ?? "Asia/Tehran";

  const fmt = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    ...(opts?.withWeekday ? { weekday: "long" as const } : {}),
  });

  // Intl معمولا خروجی با جداکننده‌های مختلف می‌دهد؛ برای UI غالبا خوبه.
  return fmt.format(d);
}

/**
 * فقط ساعت (timezone-safe)
 * مثال خروجی: ۰۹:۰۵ یا ۰۹:۰۵:۱۲
 */
export function formatTimeTZ(
  value: DateInput,
  opts?: {
    timeZone?: string;
    withSeconds?: boolean;
    hour12?: boolean; // false => 24h
  }
) {
  const d = toDate(value);
  if (!d) return "-";

  const timeZone = opts?.timeZone ?? "Asia/Tehran";

  const fmt = new Intl.DateTimeFormat("fa-IR", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    ...(opts?.withSeconds ? { second: "2-digit" as const } : {}),
    hour12: opts?.hour12 ?? false,
  });

  return fmt.format(d);
}

/**
 * تاریخ + ساعت شمسی (timezone-safe)
 * مثال خروجی: ۱۴۰۴/۱۰/۰۹ - ۰۹:۰۵
 */
export function formatJalaliDateTimeTZ(
  value: DateInput,
  opts?: {
    timeZone?: string;
    withSeconds?: boolean;
    withWeekday?: boolean;
  }
) {
  const date = formatJalaliDateTZ(value, {
    timeZone: opts?.timeZone,
    withWeekday: opts?.withWeekday,
  });
  const time = formatTimeTZ(value, {
    timeZone: opts?.timeZone,
    withSeconds: opts?.withSeconds,
  });
  return `${date} - ${time}`;
}
