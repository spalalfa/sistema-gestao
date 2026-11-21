-- GRUPO AQUINO | Data de demissão e situação automática
-- Execute no Supabase > SQL Editor antes de publicar esta versão.

alter table public.funcionarios
  add column if not exists data_demissao date;

-- A situação AFASTADO passa a ser calculada pelo sistema a partir de
-- faltas registradas no dia, atestados/afastamentos médicos ativos e suspensões.
-- A situação DESLIGADO e a data_demissao são atualizadas automaticamente
-- quando a data_fim_aviso do aviso prévio chega ou fica para trás.

notify pgrst, 'reload schema';
