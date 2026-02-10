import { format, formatDistanceToNow, differenceInDays, parseISO, isBefore } from "date-fns";

/**
 * Format amount as Chilean Peso (CLP)
 * e.g., 150000 -> "$150.000"
 */
export function formatCLP(amount: number): string {
  return "$" + amount.toLocaleString("es-CL", { maximumFractionDigits: 0 });
}

/**
 * Format a date range as "Jan 15 - Jan 22"
 */
export function formatDateRange(start: string, end: string): string {
  const startDate = parseISO(start);
  const endDate = parseISO(end);
  return `${format(startDate, "MMM d")} - ${format(endDate, "MMM d")}`;
}

/**
 * Format relative time, e.g., "2h ago", "3d ago"
 */
export function formatRelativeTime(date: string): string {
  return formatDistanceToNow(parseISO(date), { addSuffix: true });
}

/**
 * Calculate days until a date. Positive = days remaining, negative = days overdue.
 */
export function daysUntil(date: string): number {
  return differenceInDays(parseISO(date), new Date());
}

/**
 * Check if a date is in the past (overdue)
 */
export function isOverdue(endDate: string): boolean {
  return isBefore(parseISO(endDate), new Date());
}
