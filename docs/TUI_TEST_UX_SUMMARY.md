# TUI e UX dos Testes

## Objetivo

Aplicar uma experiência de terminal mais clara para a execução dos testes, mantendo o fluxo TDD e permitindo leitura rápida durante desenvolvimento local e CI.

## Alterações aplicadas

### 1. Runner TUI para testes

Foi criado o runner `scripts/test-tui.mjs`, responsável por executar a suíte com o `node:test` e renderizar uma saída mais amigável no terminal.

Recursos adicionados:

- cabeçalho identificando a suíte;
- barra de progresso por teste;
- contador `executados/total`;
- status visual `PASS`, `FAIL`, `SKIPPED` e `TODO`;
- duração compacta por caso de teste;
- resumo final com totais;
- captura de avisos do build/test runner;
- sugestão de ação quando houver falha.

### 2. Núcleo testável do TUI

Foi criado `scripts/test-tui-core.mjs` com funções puras para:

- interpretar linhas TAP;
- montar barra de progresso;
- formatar duração;
- consolidar resumo da suíte;
- identificar falhas.

Esse núcleo reduz acoplamento entre renderização de terminal e regras de interpretação dos testes.

### 3. Testes TDD do próprio runner

Foi criado `test/testTuiRunner.test.mjs` cobrindo:

- parsing de subtestes TAP;
- parsing de resultados aprovados, falhos, ignorados e TODO;
- geração de barra de progresso estável;
- sumarização de resultados;
- formatação compacta de duração.

### 4. Scripts npm

Scripts atualizados:

```json
{
  "test": "npm run test:tui",
  "test:tui": "node scripts/test-tui.mjs",
  "test:plain": "node --test test/*.test.mjs"
}
```

`npm test` agora usa a experiência TUI por padrão.

`npm run test:plain` continua disponível para saída nativa do Node.js quando for necessário depurar TAP completo.

## Resultado

A suíte passou de 35 para 40 testes, adicionando cobertura dedicada ao TUI.

## Comandos validados

```bash
npm test
npm run test:plain
npm run compile
```
