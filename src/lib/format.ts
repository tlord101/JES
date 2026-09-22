/**
 * Small date helpers shared by the portals so every screen prints Nigerian
 * school dates in the same `12 Feb 2025` shape.
 */

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return '—';
  const date =
    typeof value === 'string'
      ? new Date(value.length === 10 ? `${value}T00:00:00` : value)
      : value;

  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return '—';
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Today as `YYYY-MM-DD`, which is what `<input type="date">` expects. */
export function todayIso(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

/** `First Term · 2024/2025` */
export function termLabel(
  term: { name: string } | null | undefined,
  academicYearName?: string | null
): string {
  if (!term) return 'No active term';
  return academicYearName ? `${term.name} · ${academicYearName}` : term.name;
}

/** Human readable enum/token label: `junior_secondary` -> `Junior Secondary`. */
export function titleCase(value: string | null | undefined): string {
  if (!value) return '—';
  return value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/** `₦185,000.00` */
export function formatCurrency(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '—';
  const amount = Number(value);
  if (!Number.isFinite(amount)) return '—';
  return `₦${amount.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** `08:30` — portal timetables store `HH:MM:SS` time values. */
export function formatTime(value: string | null | undefined): string {
  if (!value) return '—';
  const [hours, minutes] = value.split(':');
  if (!hours || !minutes) return value;
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
}

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** `1` -> `Monday` (timetables store ISO weekdays 1–5). */
export function weekdayLabel(day: number): string {
  return WEEKDAYS[day] ?? `Day ${day}`;
}

/** Rounded percentage helper used by the attendance tiles. */
export function percentage(part: number, whole: number): number {
  if (whole <= 0) return 0;
  return Math.round((part / whole) * 1000) / 10;
}
