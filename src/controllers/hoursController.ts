import {
  calcWorkedMinutes,
  minutesToHours,
  weekRange,
  TARGET_WEEK_HOURS,
  TARGET_MONTH_HOURS,
  SATURDAY_MAX_HOURS,
} from '../utils/dateUtils';
import { isHoliday as isHolidayDate } from '../utils/holidays';
import type { WorkLog, DayCalculation, WeekSummary, MonthSummary } from '../utils/types';

export const hoursController = {
  toDayCalculation(log: WorkLog | null, date: Date): DayCalculation {
    const entry = log?.entry_time ?? null;
    const exit = log?.exit_time ?? null;
    const lunch = log?.lunch_minutes ?? 0;
    const mins = calcWorkedMinutes(entry, exit, lunch);
    const dayOfWeek = date.getDay(); // 6 = sábado
    const key = date.toISOString().slice(0, 10);
    return {
      date: key,
      entry,
      exit,
      lunchMinutes: lunch,
      workedMinutes: mins,
      workedHours: minutesToHours(mins),
      isWeekend: dayOfWeek === 0,
      isHoliday: (log?.is_holiday ?? false) || isHolidayDate(key),
    };
  },

  weekSummary(weekStart: Date, logsByDate: Map<string, WorkLog>): WeekSummary {
    const { start, end } = weekRange(weekStart);
    const days: DayCalculation[] = [];
    let cursor = new Date(start);
    while (cursor <= end) {
      const key = cursor.toISOString().slice(0, 10);
      const log = logsByDate.get(key) ?? null;
      days.push(this.toDayCalculation(log, cursor));
      cursor = new Date(cursor.getTime() + 86400000);
    }
    const workedHours = days.reduce((a, d) => a + d.workedHours, 0);
    // Festivos en días laborales (lun-sáb) descuentan 8h del objetivo semanal
    const holidayWorkdays = days.filter((d) => d.isHoliday && !d.isWeekend).length;
    const target = TARGET_WEEK_HOURS - holidayWorkdays * 8;
    const excess = workedHours > target ? workedHours - target : 0;
    const deficit = workedHours < target ? target - workedHours : 0;
    return {
      weekStart: start.toISOString().slice(0, 10),
      weekEnd: end.toISOString().slice(0, 10),
      targetHours: target,
      workedHours: Math.round(workedHours * 100) / 100,
      excessHours: Math.round(excess * 100) / 100,
      deficitHours: Math.round(deficit * 100) / 100,
      days,
    };
  },

  monthSummary(year: number, month: number, logsByDate: Map<string, WorkLog>): MonthSummary {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);
    const days: DayCalculation[] = [];
    let cursor = new Date(start);
    while (cursor <= end) {
      const key = cursor.toISOString().slice(0, 10);
      const log = logsByDate.get(key) ?? null;
      days.push(this.toDayCalculation(log, cursor));
      cursor = new Date(cursor.getTime() + 86400000);
    }
    const workedHours = days.reduce((a, d) => a + d.workedHours, 0);
    const holidayWorkdays = days.filter((d) => d.isHoliday && !d.isWeekend).length;
    const target = TARGET_MONTH_HOURS - holidayWorkdays * 8;

    // semanas del mes (lunes-domingo), agrupando días
    const weeks: WeekSummary[] = [];
    const seen = new Set<string>();
    for (const d of days) {
      const ws = weekRange(new Date(d.date + 'T00:00:00')).start.toISOString().slice(0, 10);
      if (seen.has(ws)) continue;
      seen.add(ws);
      // solo incluir semanas que tengan al menos un día del mes
      const wsDate = new Date(ws + 'T00:00:00');
      // filtrar días fuera del mes no suman (pero sí se muestran en calendario semanal)
      weeks.push(this.weekSummary(wsDate, logsByDate));
    }

    return {
      month: `${year}-${String(month).padStart(2, '0')}`,
      targetHours: target,
      workedHours: Math.round(workedHours * 100) / 100,
      days,
      weeks,
    };
  },

  saturdayExcess(day: DayCalculation): number {
    if (new Date(day.date + 'T00:00:00').getDay() !== 6) return 0;
    if (day.workedHours > SATURDAY_MAX_HOURS) return day.workedHours - SATURDAY_MAX_HOURS;
    return 0;
  },
};
