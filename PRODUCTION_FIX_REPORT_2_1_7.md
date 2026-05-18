# Production Fix Report 2.1.7

## Objetivo

Corrigir a extensão instalada no VS Code que ativava a aba `AI Review`, mas deixava as views internas vazias.

## Causa raiz

O build anterior gerava `dist/extension.js` com dependências externas de runtime, principalmente `typescript`, `ts-morph` e `@ts-morph/common`.

Como o VSIX de produção não empacota `node_modules`, a extensão podia falhar durante a ativação no VS Code real, antes de registrar corretamente os providers das views.

## Correções aplicadas

- Atualização da versão para `2.1.7`.
- Remoção de dependências externas indevidas no bundle de produção.
- Bundle final passou a incluir as dependências necessárias dentro de `dist/extension.js`.
- Mantido apenas `vscode` como dependência externa, conforme padrão de extensões VS Code.
- Removidos sourcemaps/metafile do build de produção.
- VSIX final permanece limpo, contendo apenas arquivos necessários para execução.

## Validação executada

```bash
npm install --package-lock-only --ignore-scripts
npm run typecheck --workspace git-code-review
npm run test:smoke --workspace git-code-review
npm run build --workspace git-code-review
npm run package:vscode
npm run audit:critical
```

## Validação de runtime do VSIX

O VSIX foi descompactado em ambiente isolado e o `dist/extension.js` foi carregado sem `node_modules`, com mock apenas do módulo `vscode`.

Resultado:

```text
runtime activation ok
```

## Observação

O bundle ficou maior porque agora inclui as dependências necessárias para execução real no VS Code sem depender de `node_modules` dentro do VSIX.
