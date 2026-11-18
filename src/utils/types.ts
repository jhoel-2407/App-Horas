export interface WorkLog {
  id?: string;
  date: string; // YYYY-MM-DD
  entry_time: string | null; // HH:mm
  exit_time: string | null; // HH:mm
  lunch_minutes: number; // minutos de almuerzo
  is_holiday?: boolean;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DayCalculation {
  date: string;
  entry: string | null;
  exit: string | null;
  lunchMinutes: number;
  workedMinutes: number; // minutos trabajados (salida - entrada - almuerzo)
  workedHours: number;
  isWeekend: boolean;
  isHoliday: boolean;
}

export interface WeekSummary {
  weekStart: string; // YYYY-MM-DD (lunes)
  weekEnd: string;
  targetHours: number; // 42
  workedHours: number;
  excessHours: number; // si worked > 42
  deficitHours: number; // si worked < 42
  days: DayCalculation[];
}

export interface MonthSummary {
  month: string; // YYYY-MM
  targetHours: number; // 168
  workedHours: number;
  days: DayCalculation[];
  weeks: WeekSummary[];
}
