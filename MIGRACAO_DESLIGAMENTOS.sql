-- GRUPO AQUINO | Aviso prévio e desligamentos
-- Execute no Supabase > SQL Editor antes de usar a nova subaba DEMISSÃO.

create table if not exists public.desligamentos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  funcionario text,
  matricula text,
  funcao text,
  admissao date,
  tipo_aviso text,
  modalidade_aviso text,
  data_inicio date,
  data_fim_aviso date,
  motivo_dispensa text,
  observacao text
);

alter table public.desligamentos add column if not exists funcionario text;
alter table public.desligamentos add column if not exists matricula text;
alter table public.desligamentos add column if not exists funcao text;
alter table public.desligamentos add column if not exists admissao date;
alter table public.desligamentos add column if not exists tipo_aviso text;
alter table public.desligamentos add column if not exists modalidade_aviso text;
alter table public.desligamentos add column if not exists data_inicio date;
alter table public.desligamentos add column if not exists data_fim_aviso date;
alter table public.desligamentos add column if not exists motivo_dispensa text;
alter table public.desligamentos add column if not exists observacao text;
alter table public.desligamentos add column if not exists updated_at timestamptz;

alter table public.desligamentos enable row level security;
drop policy if exists "authenticated select" on public.desligamentos;
drop policy if exists "authenticated insert" on public.desligamentos;
drop policy if exists "authenticated update" on public.desligamentos;
drop policy if exists "authenticated delete" on public.desligamentos;
create policy "authenticated select" on public.desligamentos for select to authenticated using (true);
create policy "authenticated insert" on public.desligamentos for insert to authenticated with check (true);
create policy "authenticated update" on public.desligamentos for update to authenticated using (true) with check (true);
create policy "authenticated delete" on public.desligamentos for delete to authenticated using (true);
grant select, insert, update, delete on public.desligamentos to authenticated;

notify pgrst, 'reload schema';
