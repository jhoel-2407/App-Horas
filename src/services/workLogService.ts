import { supabase } from './supabaseClient';
import type { WorkLog } from '../utils/types';

const TABLE = 'work_logs';
const LS_KEY = 'work_logs_v1';

function lsRead(): WorkLog[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function lsWrite(list: WorkLog[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(list));
}

export const workLogService = {
  async getAll(): Promise<WorkLog[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from(TABLE)
        .select('*')
        .order('date', { ascending: true });
      if (error) throw error;
      return (data as WorkLog[]) ?? [];
    }
    return lsRead();
  },

  async getByDate(date: string): Promise<WorkLog | null> {
    if (supabase) {
      const { data, error } = await supabase
        .from(TABLE)
        .select('*')
        .eq('date', date)
        .maybeSingle();
      if (error) throw error;
      return (data as WorkLog) ?? null;
    }
    return lsRead().find((l) => l.date === date) ?? null;
  },

  async upsert(log: WorkLog): Promise<WorkLog> {
    const now = new Date().toISOString();
    const record: WorkLog = {
      ...log,
      id: log.id ?? crypto.randomUUID(),
      created_at: log.created_at ?? now,
      updated_at: now,
      lunch_minutes: log.lunch_minutes ?? 60,
      is_holiday: log.is_holiday ?? false,
    };
    if (supabase) {
      const { data, error } = await supabase
        .from(TABLE)
        .upsert(record, { onConflict: 'date' })
        .select()
        .single();
      if (error) throw error;
      return data as WorkLog;
    }
    const list = lsRead();
    const idx = list.findIndex((l) => l.date === log.date);
    if (idx >= 0) list[idx] = record;
    else list.push(record);
    lsWrite(list);
    return record;
  },

  async remove(date: string): Promise<void> {
    if (supabase) {
      const { error } = await supabase.from(TABLE).delete().eq('date', date);
      if (error) throw error;
      return;
    }
    const list = lsRead().filter((l) => l.date !== date);
    lsWrite(list);
  },
};
