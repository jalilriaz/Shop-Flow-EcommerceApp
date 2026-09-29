import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as currency (USD) */
export function formatPrice(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

/** Calculate discount percentage */
export function discountPercent(original: number, sale: number): number {
  return Math.round(((original - sale) / original) * 100);
}

/** Truncate string to n characters */
export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n - 1) + "…" : str;
}

/** Simulate async delay (for mock data loading) */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Format date string */
export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateStr));
}

/** Generate a random ID */
export function generateId(): string {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}
