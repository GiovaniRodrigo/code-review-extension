# Correção: Experiência sem mocks em produção

## Objetivo

Remover dados fictícios da experiência principal da extensão e garantir que Community/Premium exibam somente estado real do runtime.

## Alterações aplicadas

- Removidos problemas hardcoded do painel direito.
- Painel direito agora usa apenas findings, comentários reais e diagnostics reais do VS Code.
- Dashboard não exibe score artificial antes de existir sessão real.
- Ring de score exibe estado vazio quando não há análise real.
- Ações que dependem de sessão real ficam desabilitadas quando não há sessão.
- Provider Community de IA não fabrica sugestões quando nenhuma IA local/VS Code está configurada.
- Adicionado registro seguro de comandos para evitar falha quando outra versão da extensão estiver instalada.
- Reduzida duplicação visual do card Community/Premium: o painel direito não repete o card de edição.

## Regra de produto

Mock só pode existir em teste, fixture ou ambiente de desenvolvimento. A UI principal deve mostrar estados reais, vazios ou pendentes de configuração.
