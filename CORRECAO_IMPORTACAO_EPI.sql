-- CORREÇÃO DEFINITIVA DA IMPORTAÇÃO DE EPI
-- Execute no Supabase > SQL Editor. Não apaga registros.
-- O campo status_item é informativo (NOVO/USADO) e bancos antigos podem ter
-- CHECKs incompatíveis criados por versões anteriores do sistema.
do $$
declare c record;
begin
  for c in
    select conname
    from pg_constraint
    where conrelid = 'public.lancamentos_materiais'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%status_item%'
  loop
    execute format('alter table public.lancamentos_materiais drop constraint %I', c.conname);
  end loop;
end $$;

-- Garante as colunas utilizadas pelo importador atualizado.
alter table public.lancamentos_materiais add column if not exists categoria_item text;
alter table public.lancamentos_materiais add column if not exists ficha_epi text;
alter table public.lancamentos_materiais add column if not exists tempo_validade integer;
alter table public.lancamentos_materiais add column if not exists validade date;

-- O histórico pode não informar NOVO/USADO; nesse caso, o importador classifica como USADO.
update public.lancamentos_materiais set status_item = 'USADO' where status_item is null;
alter table public.lancamentos_materiais alter column status_item set default 'USADO';
alter table public.lancamentos_materiais alter column status_item set not null;

-- RLS: acesso de leitura e gravação para usuários autenticados do sistema.
alter table public.lancamentos_materiais enable row level security;
drop policy if exists "authenticated select" on public.lancamentos_materiais;
drop policy if exists "authenticated insert" on public.lancamentos_materiais;
drop policy if exists "authenticated update" on public.lancamentos_materiais;
drop policy if exists "authenticated delete" on public.lancamentos_materiais;
create policy "authenticated select" on public.lancamentos_materiais for select to authenticated using (true);
create policy "authenticated insert" on public.lancamentos_materiais for insert to authenticated with check (true);
create policy "authenticated update" on public.lancamentos_materiais for update to authenticated using (true) with check (true);
create policy "authenticated delete" on public.lancamentos_materiais for delete to authenticated using (true);
grant select, insert, update, delete on public.lancamentos_materiais to authenticated;
notify pgrst, 'reload schema';
