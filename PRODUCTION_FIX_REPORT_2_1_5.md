# Production Fix Report — 2.1.5

## Correções aplicadas após validação no VS Code

- Versão incrementada para `2.1.5` para forçar atualização limpa no VS Code.
- Corrigido ícone do container da Activity Bar: `viewsContainers.activitybar.icon` agora aponta para `media/activitybar.svg`.
- Adicionados `activationEvents` explícitos para todos os comandos e views da extensão.
- Adicionados menus no `commandPalette`, `view/title` e `editor/context` para tornar os comandos acessíveis no VS Code.
- Adicionado comando ausente `code-review.setGitHubToken` ao `package.json`.
- Corrigido `code-review.focus` para abrir a view `AI Review` corretamente via `workbench.view.extension.code-review`.
- Corrigido fluxo final do setup guiado: remove chamada inválida para `code-review.dashboard` e usa `code-review.focus`.
- Corrigido menu de chaves para mapear corretamente GitHub/GitLab/OpenAI/Gemini.
- Corrigido `code-review.setupRag`, que antes chamava o próprio setup novamente. Agora abre ações reais de RAG: indexar, limpar, buscar e configurações.

## Validações executadas

```bash
npm install --ignore-scripts
npm run typecheck --workspace git-code-review
npm run build
npm run package:vscode
```

O `test:smoke` executou os testes e exibiu `2 passed / 3 tests passed`, mas o processo ficou preso até timeout no ambiente de validação. Por isso, não foi usado como gate final automático nesta rodada.

## VSIX gerado

```text
git-code-review-2.1.5.vsix
```

Arquivos incluídos no VSIX:

```text
LICENSE.txt
changelog.md
package.json
readme.md
dist/extension.js
media/activitybar.svg
media/reviewView.css
media/reviewView.html
media/reviewView.js
```
