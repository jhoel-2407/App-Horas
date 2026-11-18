// Festivos colombianos (Ley Emiliani) calculados por año

function easterSunday(year: number): Date {
  // Algoritmo de Meeus/Jones/Butcher
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 3=marzo, 4=abril
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function toKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function nextMonday(d: Date): Date {
  const day = d.getDay(); // 0 dom ... 6 sab, 1 lun
  const diff = (1 - day + 7) % 7;
  return addDays(d, diff === 0 ? 0 : diff);
}

function fixed(year: number, month: number, day: number): string {
  return toKey(new Date(year, month - 1, day));
}

function moved(year: number, month: number, day: number): string {
  return toKey(nextMonday(new Date(year, month - 1, day)));
}

export function getColombianHolidays(year: number): Set<string> {
  const set = new Set<string>();
  const easter = easterSunday(year);

  // Fijos (no se trasladan)
  set.add(fixed(year, 1, 1));   // Año Nuevo
  set.add(fixed(year, 5, 1));   // Día del Trabajo
  set.add(fixed(year, 7, 20));  // Independencia
  set.add(fixed(year, 8, 7));   // Batalla de Boyacá
  set.add(fixed(year, 12, 8));  // Inmaculada Concepción
  set.add(fixed(year, 12, 25)); // Navidad

  // Trasladables (Ley Emiliani)
  set.add(moved(year, 1, 6));   // Reyes Magos
  set.add(moved(year, 3, 19));  // San José
  set.add(moved(year, 6, 29));  // San Pedro y San Pablo
  set.add(moved(year, 8, 15));  // Asunción de la Virgen
  set.add(moved(year, 10, 12)); // Día de la Raza
  set.add(moved(year, 11, 1));  // Todos los Santos
  set.add(moved(year, 11, 11)); // Independencia de Cartagena

  // Semana Santa
  set.add(toKey(addDays(easter, -3))); // Jueves Santo
  set.add(toKey(addDays(easter, -2))); // Viernes Santo

  // Religiosos trasladables
  set.add(toKey(nextMonday(addDays(easter, 39)))); // Ascensión del Señor (40 días)
  set.add(toKey(nextMonday(addDays(easter, 60)))); // Corpus Christi
  set.add(toKey(nextMonday(addDays(easter, 68)))); // Sagrado Corazón

  return set;
}

export function isHoliday(date: string): boolean {
  const y = parseInt(date.slice(0, 4), 10);
  return getColombianHolidays(y).has(date);
}
