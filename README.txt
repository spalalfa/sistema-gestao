GRUPO AQUINO — SISTEMA DE GESTÃO E CONTROLE (MVP INICIAL)

ARQUIVOS
- index.html: interface responsiva e tela de login
- styles.css: identidade visual azul-marinho, desktop e celular
- app.js: navegação, formulários, CRUD e conexão com Supabase
- supabase.sql: tabelas e políticas iniciais do banco de dados

COMO CONFIGURAR
1. Crie um projeto em https://supabase.com.
2. No SQL Editor do projeto, execute todo o conteúdo de supabase.sql.
3. Em Project Settings > API, copie Project URL e a chave anon/public.
4. Cole os valores nas constantes SUPABASE_URL e SUPABASE_ANON_KEY no começo de app.js.
5. Em Authentication > Users, crie o usuário administrador com e-mail e senha.
6. Publique os arquivos em hospedagem HTTPS (por exemplo, Hostinger ou GitHub Pages).

IMPORTANTE
- Não coloque a chave service_role no JavaScript do navegador.
- As políticas SQL incluídas permitem CRUD a qualquer usuário autenticado. Antes de uso real, implementar perfis/permissões detalhados e restringir ações por função.
- O MVP já contempla cadastro e listagem/edição/exclusão básica de funcionários, frota, equipamentos, férias, registros médicos, faltas, disciplina e materiais.
- Os demais campos solicitados no briefing ainda precisam ser acrescentados: documentos completos, endereço via CEP, cálculos de experiência/tempo de serviço/retorno/validade, alertas, permissões por módulo, upload de anexos, relatórios e trilha de auditoria.
- Dados pessoais e de saúde (CPF, documentos, CID e atestados) exigem controles adequados de acesso, retenção e conformidade com a LGPD. Não use dados reais até revisar a segurança.
- Campos comuns são convertidos para MAIÚSCULAS na digitação, exceto e-mail e senha.
