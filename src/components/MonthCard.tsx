import type { MonthSummary } from '../utils/types';

interface Props {
  summary: MonthSummary;
}

export default function MonthCard({ summary }: Props) {
  const pct = Math.min(100, (summary.workedHours / summary.targetHours) * 100);
  const excess = summary.workedHours - summary.targetHours;
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold">Resumen del mes {summary.month}</h3>
        <span className="text-lg font-bold text-blue-700">
          {summary.workedHours}h / {summary.targetHours}h
        </span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-3 mb-2">
        <div
          className={`h-3 rounded-full ${pct >= 100 ? 'bg-green-500' : pct >= 75 ? 'bg-blue-500' : 'bg-amber-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="text-sm text-slate-600">
        {excess >= 0 ? (
          <span className="text-green-600 font-semibold">Excedente total: +{Math.round(excess * 100) / 100}h</span>
        ) : (
          <span className="text-red-600 font-semibold">Faltante: {Math.round(excess * 100) / 100}h</span>
        )}
      </div>
    </div>
  );
}
