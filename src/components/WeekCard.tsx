import type { WeekSummary } from '../utils/types';

interface Props {
  summary: WeekSummary;
}

export default function WeekCard({ summary }: Props) {
  const pct = Math.min(100, (summary.workedHours / summary.targetHours) * 100);
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-sm">
          Semana {summary.weekStart} → {summary.weekEnd}
        </h3>
        <span className="text-sm font-semibold">
          {summary.workedHours}h / {summary.targetHours}h
        </span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
        <div
          className={`h-2 rounded-full ${pct >= 100 ? 'bg-green-500' : pct >= 80 ? 'bg-blue-500' : 'bg-amber-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex gap-3 text-xs">
        {summary.excessHours > 0 && (
          <span className="text-amber-600 font-semibold">Excedente: +{summary.excessHours}h</span>
        )}
        {summary.deficitHours > 0 && (
          <span className="text-red-600 font-semibold">Faltante: -{summary.deficitHours}h</span>
        )}
        {summary.excessHours === 0 && summary.deficitHours === 0 && (
          <span className="text-green-600 font-semibold">✓ Meta cumplida</span>
        )}
      </div>
    </div>
  );
}
