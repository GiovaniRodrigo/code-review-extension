# Correções de Sessão por PR/Branch e Diagnósticos

## Implementado

- Cada sessão de avaliação agora é vinculada por chave de origem:
  - `pr:<pullRequestId>:<baseBranch>` quando a revisão é iniciada por PR.
  - `branch:<sourceBranch>:<baseBranch>` quando a revisão é iniciada por branch.
- Ao iniciar uma revisão em outro PR/branch, o sistema não reaproveita dados da sessão anterior.
- Ao reabrir uma sessão já existente para o mesmo PR/branch, os dados daquela avaliação são preservados.
- Comentários continuam editáveis apenas pelo autor original ou por `admin`.
- O menu Diagnósticos deixou de usar linhas fictícias quando não existem findings/problemas reais.
- A tabela de Diagnósticos agora mostra dados reais vindos de:
  - findings da sessão atual;
  - VS Code Problems API.
- A ação **Abrir diff** em Diagnósticos abre a aba nativa de diff do VS Code.
- O tooltip de **Validar arquitetura** foi reposicionado para baixo e recebeu `overflow: visible` nos contêineres para evitar corte pela borda do painel.
- O CRUD de categorias de validação permanece disponível no menu Diagnósticos para criar, renomear e remover categorias usadas pela equipe.

## Validação

- `npm run compile`: OK
- `npm test`: OK, 31/31 testes passando
