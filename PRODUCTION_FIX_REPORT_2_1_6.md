# Production Fix Report — 2.1.6

## Objetivo

Corrigir o problema visual identificado no VS Code após a instalação da versão 2.1.5, onde os comandos da extensão apareciam como textos longos no cabeçalho das views laterais, prejudicando a usabilidade da Activity Bar `AI Review`.

## Correções aplicadas

| Área | Correção |
|---|---|
| Sidebar do VS Code | Adicionados ícones Codicon aos comandos para que ações em `view/title` apareçam como botões visuais, não como textos longos. |
| Command Palette | Comandos agora usam `category: Code Review`, deixando os nomes mais limpos e padronizados. |
| Views | Nomes encurtados para `Dashboard`, `Findings`, `Chat`, `RAG` e `Graph`. |
| Visibilidade inicial | `Dashboard`, `Findings` e `Chat` ficam visíveis; `RAG` e `Graph` ficam recolhidos por padrão. |
| Menus da view | Apenas ações principais ficam na barra da view; ações secundárias de RAG foram movidas para o menu de overflow. |
| Versionamento | Extensão atualizada para `2.1.6`. |

## Validação executada

```bash
npm run typecheck --workspace git-code-review
npm run build --workspace git-code-review
npm run test:smoke --workspace git-code-review
npm run package:vscode
npm run audit:critical
```

## Resultado

| Validação | Resultado |
|---|---|
| Typecheck | OK |
| Build | OK |
| Smoke tests | OK — 3 testes passaram |
| Package VSIX | OK |
| Audit crítico | OK — sem vulnerabilidade crítica |

## Observações

Ainda existem vulnerabilidades `low`, `moderate` e `high` em dependências de desenvolvimento, principalmente relacionadas a ferramentas de teste/mutação. Não foram encontradas vulnerabilidades críticas no gate executado.
