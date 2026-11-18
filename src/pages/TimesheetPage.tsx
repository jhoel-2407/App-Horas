import { useEffect, useState, useCallback } from 'react';
import { workLogService } from '../services/workLogService';
import { hoursController } from '../controllers/hoursController';
import { isSupabaseConfigured, supabaseConfigHint } from '../services/supabaseClient';
import type { WorkLog } from '../utils/types';
import Header from '../components/Header';
import Calendar from '../components/Calendar';
import DayModal from '../components/DayModal';
import WeekCard from '../components/WeekCard';
import MonthCard from '../components/MonthCard';

interface Props {
  readOnly?: boolean;
}

export default function TimesheetPage({ readOnly = false }: Props) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [logs, setLogs] = useState<WorkLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalDate, setModalDate] = useState<string | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await workLogService.getAll();
      setLogs(data);
    } catch (e: any) {
      setError(e?.message ?? 'Error cargando datos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const logsByDate = new Map(logs.map((l) => [l.date, l]));
  const summary = hoursController.monthSummary(year, month, logsByDate);

  const modalLog = modalDate ? logsByDate.get(modalDate) ?? null : null;

  const handleSave = async (log: WorkLog) => {
    await workLogService.upsert(log);
    await load();
  };

  const handleDelete = async () => {
    if (modalDate) {
      await workLogService.remove(modalDate);
      await load();
    }
  };

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(year - 1); }
    else setMonth(month - 1);
  };
  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(year + 1); }
    else setMonth(month + 1);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={prevMonth} className="px-3 py-1 bg-white rounded-lg shadow hover:bg-slate-50">◀</button>
            <h2 className="text-xl font-bold">
              {new Date(year, month - 1, 1).toLocaleString('es-CO', { month: 'long', year: 'numeric' })}
            </h2>
            <button onClick={nextMonth} className="px-3 py-1 bg-white rounded-lg shadow hover:bg-slate-50">▶</button>
          </div>
          {readOnly && (
            <span className="text-sm bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-semibold">
              Modo solo lectura (Jefe)
            </span>
          )}
        </div>

        {!isSupabaseConfigured() && (
          <div className="bg-amber-100 text-amber-800 p-3 rounded-lg text-sm">
            ⚠️ Supabase no configurado: los datos se guardan solo en este navegador (localStorage).
            {supabaseConfigHint() && <div className="mt-1 font-mono text-xs">{supabaseConfigHint()}</div>}
            Para compartir con tu jefe, configura Supabase (ver README) y reinicia el servidor.
          </div>
        )}
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg">{error}</div>}

        {loading ? (
          <div className="text-center py-12 text-slate-500">Cargando...</div>
        ) : (
          <>
            <MonthCard summary={summary} />
            <Calendar
              year={year}
              month={month}

              readOnly={readOnly}
              onDayClick={setModalDate}
              summary={summary}
            />
            <div className="grid md:grid-cols-2 gap-4">
              {summary.weeks.map((w) => (
                <WeekCard key={w.weekStart} summary={w} />
              ))}
            </div>
          </>
        )}
      </main>

      {!readOnly && modalDate && (
        <DayModal
          date={modalDate}
          initial={modalLog}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setModalDate(null)}
        />
      )}
    </div>
  );
}
