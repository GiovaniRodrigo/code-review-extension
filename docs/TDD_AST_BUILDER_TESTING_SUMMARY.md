# TDD - AST Builder

## Objetivo

Atualizar os testes do backend seguindo uma abordagem TDD para consolidar o comportamento esperado do AST Builder antes da implementação final.

## Ciclo aplicado

1. **Red**: foram adicionados testes descrevendo comportamentos esperados ainda frágeis no AST Builder.
2. **Green**: o `RegexSourceAstBuilder` foi ajustado para atender aos testes.
3. **Refactor**: a leitura estrutural foi isolada em funções auxiliares para reduzir falsos positivos e manter baixo acoplamento com as regras arquiteturais.

## Testes adicionados/ajustados

Arquivo principal:

- `test/astBuilder.test.mjs`

Coberturas adicionadas:

- Mapeamento de nós estruturais usados pelas regras de arquitetura.
- Ignorar código falso dentro de comentários e strings.
- Manter métodos e condicionais vinculados ao escopo ativo de classe/interface.

## Implementação ajustada

Arquivo principal:

- `src/domain/ast/regexSourceAstBuilder.ts`

Alterações:

- Sanitização de comentários de linha e bloco.
- Sanitização de strings para evitar falsos positivos em análise estrutural.
- Preservação da leitura de imports reais.
- Correção de escopo ativo para associar métodos e condicionais à declaração correta.
- Extração segura de argumentos de `throw new Error(...)` sem interferir no estado de regex global.

## Validação

- `npm test`: 35/35 testes aprovados.
- `npm run compile`: build da extensão e webview concluído.
