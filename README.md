# Control de Horas Laboradas

Aplicación web para registrar y visualizar las horas trabajadas día a día.

## Stack
- React + TypeScript (Vite)
- Tailwind CSS
- Supabase (PostgreSQL) — con fallback a localStorage si no se configura

## Estructura
```
src/
  services/       -> clientes y acceso a datos (Supabase / localStorage)
  controllers/    -> lógica de negocio (cálculo de horas, resúmenes)
  routes/         -> configuración de rutas (react-router)
  pages/          -> vistas (Empleado, Jefe)
  components/     -> componentes reutilizables
  utils/          -> tipos y utilidades de fecha
```

## Configuración

1. Instalar dependencias:
   ```
   npm install
   ```

2. (Opcional) Configurar Supabase:
   - Crear proyecto en https://supabase.com
   - Ejecutar `supabase/schema.sql` en el SQL Editor
   - Copiar `.env.example` a `.env` y completar:
     ```
     VITE_SUPABASE_URL=...
     VITE_SUPABASE_ANON_KEY=...
     ```
   - Sin estas variables la app usa localStorage (solo local).

3. Desarrollo:
   ```
   npm run dev
   ```

4. Build de producción:
   ```
   npm run build
   ```

## Deploy en Vercel
- Conectar el repositorio a Vercel
- Agregar variables de entorno `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
- Vercel detecta Vite automáticamente

## Uso
- `/` → Vista empleado (editar registros)
- `/boss` → Vista jefe (solo lectura)

## Reglas de negocio
- Meta semanal: 42 horas (se descuentan 8h por cada festivo en día laboral)
- Meta mensual: 168 horas (se descuentan 8h por cada festivo en día laboral)
- Sábado: máximo 4 horas
- Horas de almuerzo se restan del total del día
- Excedentes se muestran cuando se superan las 42h semanales
- Festivos colombianos (Ley Emiliani) se marcan automáticamente en morado; se pueden ajustar manualmente por día
