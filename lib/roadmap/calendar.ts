import { PERIOD_LABELS, PERIODS } from './constants';
import type { AcademicYear, PeriodSlot, StudentProfile } from './types';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const PERIOD_SPAN: Record<PeriodSlot, { offset: number; months: number }> = {
  'M1-2': { offset: 0, months: 2 },
  'M3-4': { offset: 2, months: 2 },
  'M5-6': { offset: 4, months: 2 },
  'M7-9': { offset: 6, months: 3 },
  'M10-12': { offset: 9, months: 3 },
};

export function parseOnboardDate(iso?: string | null, fallback = new Date()): Date {
  if (!iso) return fallback;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? fallback : date;
}

export function addMonths(date: Date, months: number): Date {
  const next = new Date(date.getFullYear(), date.getMonth(), 1);
  const day = date.getDate();
  next.setMonth(next.getMonth() + months);
  const last = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
  next.setDate(Math.min(day, last));
  next.setHours(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
  return next;
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function remainingYears(currentYear: AcademicYear): number {
  return (5 - currentYear) as 1 | 2 | 3 | 4;
}

export function yearStartDate(onboardedAt: Date, currentYear: AcademicYear, year: AcademicYear): Date {
  return addMonths(onboardedAt, Math.max(0, year - currentYear) * 12);
}

export function journeyEndDate(onboardedAt: Date, currentYear: AcademicYear): Date {
  return addDays(addMonths(onboardedAt, remainingYears(currentYear) * 12), -1);
}

export function periodWindow(
  onboardedAt: Date,
  currentYear: AcademicYear,
  year: AcademicYear,
  period: PeriodSlot
): { start: Date; end: Date } {
  const start = addMonths(yearStartDate(onboardedAt, currentYear, year), PERIOD_SPAN[period].offset);
  const end = addDays(addMonths(start, PERIOD_SPAN[period].months), -1);
  return { start, end };
}

export function formatDay(date: Date): string {
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatRange(start: Date, end: Date): string {
  const sameYear = start.getFullYear() === end.getFullYear();
  const sameMonth = sameYear && start.getMonth() === end.getMonth();
  if (sameMonth) return `${start.getDate()}–${end.getDate()} ${MONTHS[end.getMonth()]} ${end.getFullYear()}`;
  if (sameYear) {
    return `${start.getDate()} ${MONTHS[start.getMonth()]} – ${end.getDate()} ${MONTHS[end.getMonth()]} ${end.getFullYear()}`;
  }
  return `${formatDay(start)} – ${formatDay(end)}`;
}

export function calendarPeriodLabel(
  profile: Pick<StudentProfile, 'onboardedAt' | 'currentYear'>,
  year: AcademicYear,
  period: PeriodSlot
): string {
  if (!profile.onboardedAt) return PERIOD_LABELS[period];
  const { start, end } = periodWindow(parseOnboardDate(profile.onboardedAt), profile.currentYear, year, period);
  return formatRange(start, end);
}

export function calendarYearRange(
  profile: Pick<StudentProfile, 'onboardedAt' | 'currentYear'>,
  year: AcademicYear
): string | null {
  if (!profile.onboardedAt) return null;
  const start = yearStartDate(parseOnboardDate(profile.onboardedAt), profile.currentYear, year);
  const end = addDays(addMonths(start, 12), -1);
  return formatRange(start, end);
}

export function journeySpan(profile: Pick<StudentProfile, 'onboardedAt' | 'currentYear'>): string | null {
  if (!profile.onboardedAt) return null;
  const start = parseOnboardDate(profile.onboardedAt);
  return `${formatDay(start)} → ${formatDay(journeyEndDate(start, profile.currentYear))}`;
}

export function periodContaining(
  onboardedAt: Date,
  currentYear: AcademicYear,
  year: AcademicYear,
  now = new Date()
): PeriodSlot | null {
  const t = now.getTime();
  for (const period of PERIODS) {
    const { start, end } = periodWindow(onboardedAt, currentYear, year, period);
    if (t >= start.getTime() && t <= end.getTime() + 24 * 60 * 60 * 1000 - 1) return period;
  }
  return null;
}
