import { useState, useEffect } from 'react';
import { timeToMinutes } from '../utils/dateUtils';
import { isHoliday as isHolidayDate } from '../utils/holidays';
import type { WorkLog } from '../utils/types';

interface Props {
  date: string;
  initial: WorkLog | null;
  onSave: (log: WorkLog) => Promise<void>;
  onDelete: () => Promise<void>;
  onClose: () => void;
}

export default function DayModal({ date, initial, onSave, onDelete, onClose }: Props) {
  const [entry, setEntry] = useState(initial?.entry_time ?? '');
  const [exit, setExit] = useState(initial?.exit_time ?? '');
  const [lunch, setLunch] = useState(String(initial?.lunch_minutes ?? 60));
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [isHoliday, setIsHoliday] = useState(initial?.is_holiday ?? isHolidayDate(date));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setEntry(initial?.entry_time ?? '');
    setExit(initial?.exit_time ?? '');
    setLunch(String(initial?.lunch_minutes ?? 60));
    setNotes(initial?.notes ?? '');
    setIsHoliday(initial?.is_holiday ?? isHolidayDate(date));
  }, [initial, date]);

  const preview = (() => {
    const e = timeToMinutes(entry || null);
    const x = timeToMinutes(exit || null);
    if (e === null || x === null) return 0;
    let diff = x - e;
    if (diff < 0) diff += 24 * 60;
    diff -= Number(lunch) || 0;
    return diff > 0 ? Math.round((diff / 60) * 100) / 100 : 0;
  })();

  const handleSave = async () => {
    if (!entry || !exit) {
      setError('Ingresa hora de entrada y salida');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSave({
        date,
        entry_time: entry,
        exit_time: exit,
        lunch_minutes: Number(lunch) || 0,
        is_holiday: isHoliday,
        notes,
      });
      onClose();
    } catch (e: any) {
      setError(e?.message ?? 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Registro del día {date}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Hora de entrada</label>
            <input
              type="time"
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Hora de salida</label>
            <input
              type="time"
              value={exit}
              onChange={(e) => setExit(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Minutos de almuerzo</label>
            <input
              type="number"
              min={0}
              value={lunch}
              onChange={(e) => setLunch(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isHoliday"
              checked={isHoliday}
              onChange={(e) => setIsHoliday(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="isHoliday" className="text-sm font-medium">
              Este día es festivo
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notas (opcional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              rows={2}
            />
          </div>
          <div className="bg-blue-50 rounded-lg p-3 text-sm">
            Horas trabajadas: <span className="font-bold text-blue-700">{preview}h</span>
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
        </div>
        <div className="flex gap-2 mt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-blue-600 text-white rounded-lg py-2 font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
          {initial && (
            <button
              onClick={async () => {
                if (confirm('¿Eliminar registro de este día?')) {
                  await onDelete();
                  onClose();
                }
              }}
              className="px-4 bg-red-100 text-red-700 rounded-lg py-2 font-semibold hover:bg-red-200"
            >
              Eliminar
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 bg-slate-100 rounded-lg py-2 font-semibold hover:bg-slate-200"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
