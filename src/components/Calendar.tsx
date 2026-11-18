import {
  monthDays,
} from '../utils/dateUtils';
import { isHoliday as isHolidayDate } from '../utils/holidays';
import type { MonthSummary } from '../utils/types';

interface Props {
  year: number;
  month: number;
  readOnly: boolean;
  onDayClick: (date: string) => void;
  summary: MonthSummary;
}

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export default function Calendar({ year, month, readOnly, onDayClick, summary }: Props) {
  const days = monthDays(year, month);
  // pad leading days to align Monday
  const firstDay = days[0].getDay(); // 0 dom
  const offset = firstDay === 0 ? 6 : firstDay - 1; // monday-based
  const cells: (Date | null)[] = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (const d of days) cells.push(d);
  // pad trailing
  while (cells.length % 7 !== 0) cells.push(null);

  const calcByDate = new Map(summary.days.map((d) => [d.date, d]));

  return (
    <div className="card">
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-500 mb-2">
        {WEEKDAYS.map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <div key={i} className="h-20" />;
          const key = d.toISOString().slice(0, 10);
          const calc = calcByDate.get(key);
          const isWeekend = d.getDay() === 0;
          const isSat = d.getDay() === 6;
          const isHol = (calc?.isHoliday ?? false) || isHolidayDate(key);
          const worked = calc?.workedHours ?? 0;
          return (
            <button
              key={key}
              onClick={() => !readOnly && !isWeekend && onDayClick(key)}
              disabled={readOnly || isWeekend}
              className={`h-20 rounded-lg border text-left p-1 text-xs transition ${
                isWeekend
                  ? 'bg-slate-100 text-slate-400'
                  : isHol
                  ? 'bg-purple-100 border-purple-300 hover:bg-purple-200'
                  : worked > 0
                  ? 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              } ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <div className="font-bold">{d.getDate()}</div>
              {!isWeekend && (
                <div className="mt-1">
                  <div className={worked > 0 ? 'text-blue-700 font-semibold' : 'text-slate-400'}>
                    {worked > 0 ? `${worked}h` : '—'}
                  </div>
                  {calc?.entry && calc?.exit && (
                    <div className="text-[10px] text-slate-500">
                      {calc.entry}-{calc.exit}
                    </div>
                  )}
                  {isHol && (
                    <div className="text-[10px] text-purple-700 font-semibold">Festivo</div>
                  )}
                  {isSat && worked > 4 && (
                    <div className="text-[10px] text-amber-600">+{Math.round((worked - 4) * 100) / 100}h exc</div>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
