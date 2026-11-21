-- MIGRAÇÃO: CALÇA e CAMISA são uniformes, não EPI.
-- Execute no SQL Editor do Supabase uma única vez.

-- 1) Move os registros do histórico de entregas para a categoria UNIFORME.
UPDATE public.lancamentos_materiais
SET categoria_item = 'UNIFORME'
WHERE UPPER(TRIM(COALESCE(tipo, ''))) IN ('CALÇA', 'CALCA', 'CAMISA')
  AND UPPER(TRIM(COALESCE(categoria_item, ''))) = 'EPI';

-- 2) Copia CALÇA/CAMISA do catálogo de EPI para o catálogo de uniformes,
-- preservando tamanho, status, quantidade, valor, observação e data.
INSERT INTO public.cad_uniformes
  (uniforme, tamanho, status, quantidade, valor, observacao, data_inclusao)
SELECT
  e.epi, e.tamanho, e.status, e.quantidade, e.valor, e.observacao, e.data_inclusao
FROM public.cad_epis e
WHERE UPPER(TRIM(COALESCE(e.epi, ''))) IN ('CALÇA', 'CALCA', 'CAMISA')
  AND NOT EXISTS (
    SELECT 1
    FROM public.cad_uniformes u
    WHERE UPPER(TRIM(COALESCE(u.uniforme, ''))) = UPPER(TRIM(e.epi))
      AND COALESCE(u.tamanho, '') = COALESCE(e.tamanho, '')
  );

-- 3) Remove os mesmos itens do catálogo de EPI após a cópia.
DELETE FROM public.cad_epis
WHERE UPPER(TRIM(COALESCE(epi, ''))) IN ('CALÇA', 'CALCA', 'CAMISA');
