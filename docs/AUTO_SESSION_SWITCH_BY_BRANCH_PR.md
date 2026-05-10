# Troca automática de sessão por branch/PR

## Correção implementada

O projeto agora troca a sessão aplicada automaticamente quando o usuário muda de branch ou PR.

## Regra de negócio

```txt
branch/pr atual
→ sessão ativa correspondente
→ comments/findings/diagnostics/score isolados
```

Se não existir sessão para a branch/PR atual, a UI deixa de exibir dados da sessão anterior e mostra estado sem sessão ativa para evitar mistura de avaliações.

## Arquivos alterados

- `src/application/reviewSessionService.ts`
  - adiciona sincronização da sessão atual com o contexto Git
  - busca sessão ativa por chave `branch:<branch>:<base>` ou `pr:<id>:<base>`
  - impede que dados de outra branch/PR sejam exibidos como sessão atual

- `src/infrastructure/gitSessionWatcher.ts`
  - novo watcher da Git API do VS Code
  - observa `repository.state.onDidChange()`
  - possui fallback por polling a cada 2 segundos
  - revalida contexto ao focar a janela

- `src/presentation/reviewPanel.ts`
  - adiciona `refreshFromGitContext()`
  - atualiza Webview quando o contexto Git muda

- `src/extension.ts`
  - registra o watcher na ativação da extensão

## Comportamento esperado

```bash
git checkout feature/login
```

Resultado:

```txt
Code Review carrega a sessão da branch feature/login.
```

Depois:

```bash
git checkout feature/payment
```

Resultado:

```txt
Code Review deixa de mostrar dados da branch login e carrega a sessão da branch payment.
```

## Validação executada

```bash
npm run compile
npm test
npm run package
```

Resultado:

```txt
31/31 testes passando
VSIX gerado com sucesso
```
