# Correções de Console e Runtime

## Objetivo

Eliminar os erros identificados no console do VS Code relacionados a colisão de comandos/views, lifecycle e disposables.

## Correções aplicadas

- Namespacing dos comandos para `giovaniCodeReview.openDashboard` e `giovaniCodeReview.syncRemote`.
- Namespacing da view para `giovaniCodeReview.sidebar`.
- Namespacing das configurações para `giovaniCodeReview.*`.
- Renomeação do container visual para `giovaniCodeReview`, evitando colisão com versões antigas.
- Registro seguro de comandos com verificação prévia via `vscode.commands.getCommands(true)`.
- `GitSessionWatcher` com lifecycle próprio, descarte seguro e guarda contra callbacks após dispose.
- Intervalo do watcher aumentado para 12s para reduzir polling agressivo.
- Migração preservada para sessões legadas armazenadas em `codeReview.*`.

## Resultado esperado

A extensão nova pode coexistir com versões antigas sem quebrar a ativação, embora a recomendação continue sendo desinstalar builds antigos para testes limpos.

## Validação

```bash
npm test
npm run compile
```

Resultado validado: 66 testes aprovados e build concluído.
