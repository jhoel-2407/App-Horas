import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
} from 'date-fns';
import { es } from 'date-fns/locale';

export function toDateKey(d: Date): string {
  return format(d, 'yyyy-MM-dd');
}

export function toMonthKey(d: Date): string {
  return format(d, 'yyyy-MM');
}

export function monthDays(year: number, month: number): Date[] {
  const start = startOfMonth(new Date(year, month - 1, 1));
  const end = endOfMonth(start);
  return eachDayOfInterval({ start, end });
}

export function weekRange(date: Date): { start: Date; end: Date } {
  // Semana lunes-domingo
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return { start, end };
}

export function isWeekendDay(d: Date): boolean {
  const day = d.getDay(); // 0 dom, 6 sab
  return day === 0; // domingo no laboral; sábado sí (máx 4h)
}

export function dayName(d: Date): string {
  return format(d, 'EEEE', { locale: es });
}

export function formatShort(d: Date): string {
  return format(d, 'dd/MM', { locale: es });
}

export function timeToMinutes(t: string | null): number | null {
  if (!t) return null;
  const [h, m] = t.split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}

export function minutesToHours(min: number): number {
  return Math.round((min / 60) * 100) / 100;
}

export function calcWorkedMinutes(
  entry: string | null,
  exit: string | null,
  lunchMinutes: number
): number {
  const e = timeToMinutes(entry);
  const x = timeToMinutes(exit);
  if (e === null || x === null) return 0;
  let diff = x - e;
  if (diff < 0) diff += 24 * 60; // turno nocturno
  diff -= lunchMinutes || 0;
  return diff > 0 ? diff : 0;
}

export function formatHours(h: number): string {
  const whole = Math.floor(h);
  const mins = Math.round((h - whole) * 60);
  return `${whole}h ${mins.toString().padStart(2, '0')}m`;
}

export const TARGET_WEEK_HOURS = 42;
export const TARGET_MONTH_HOURS = 168;
export const SATURDAY_MAX_HOURS = 4;
