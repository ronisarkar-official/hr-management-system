import { LOCALE } from "@/lib/constants";

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  return new Date(date).toLocaleDateString(LOCALE, options);
}

export function formatTime(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  return new Date(date).toLocaleTimeString(LOCALE, options);
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString(LOCALE)}`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString(LOCALE);
}

export function formatDateShort(date: string | Date): string {
  return formatDate(date, { day: "2-digit", month: "short" });
}

export function formatDateFull(date: string | Date): string {
  return formatDate(date, { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
}

export function formatDateNumeric(date: string | Date): string {
  return formatDate(date, { day: "2-digit", month: "short", year: "numeric" });
}
