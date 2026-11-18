-- Tabla para registros de horas laboradas
create table if not exists public.work_logs (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  entry_time time,
  exit_time time,
  lunch_minutes integer not null default 60,
  is_holiday boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Permitir acceso público (sin auth) - ajusta RLS según necesidad
alter table public.work_logs enable row level security;

create policy "public read" on public.work_logs for select using (true);
create policy "auth insert" on public.work_logs for insert with check (auth.role() = 'authenticated');
create policy "auth update" on public.work_logs for update using (auth.role() = 'authenticated');
create policy "auth delete" on public.work_logs for delete using (auth.role() = 'authenticated');

-- Trigger para updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists work_logs_updated_at on public.work_logs;
create trigger work_logs_updated_at
before update on public.work_logs
for each row execute function public.set_updated_at();
