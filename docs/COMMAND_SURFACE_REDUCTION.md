# Redução Oficial de Comandos da Extensão

## Decisão

A extensão deve expor apenas dois comandos no VS Code:

- `giovaniCodeReview.openDashboard`
- `giovaniCodeReview.syncRemote`

## Motivo

A UX oficial do projeto deve evitar excesso de comandos no Command Palette e concentrar o uso em dois fluxos principais:

1. abrir a dashboard;
2. ativar/sincronizar a versão Premium.

## Comandos removidos do manifesto

- `codeReview.startReview`
- `codeReview.openPullRequest`
- `codeReview.exportAuditLog`
- `codeReview.exportLocalDatabase`
- `codeReview.createBackup`

## Escopo

A remoção vale para:

- `activationEvents`;
- `contributes.commands`;
- `contributes.keybindings`;
- registro de comandos em `src/extension.ts`.

## Regra de manutenção

Novos comandos públicos só devem ser adicionados se forem aprovados como parte da superfície oficial da extensão.
