# AST Builder aplicado ao backend

## Objetivo

Aplicar o padrão **AST Builder** no backend da extensão para reduzir o acoplamento entre leitura textual de arquivos, regras arquiteturais e geração de findings.

## Principais alterações

- Criada a camada `src/domain/ast/` para representar uma árvore sintática simplificada do código-fonte.
- Adicionado contrato `SourceAstBuilder`, permitindo trocar a estratégia de construção da AST sem alterar as regras de arquitetura.
- Implementado `RegexSourceAstBuilder`, responsável por transformar `SourceFile` em `SourceAst`.
- Refatorado `architectureRules.ts` para consumir nós da AST em vez de depender diretamente de várias expressões regulares espalhadas nas regras.
- Mantidas as regras existentes de SOLID, Clean Architecture, DDD e dependência circular.
- Adicionado teste dedicado para validar a construção da AST.

## Benefícios arquiteturais

- Menor acoplamento entre análise sintática e regras de negócio.
- Regras arquiteturais mais declarativas e fáceis de evoluir.
- Possibilidade de substituir o builder atual por parser real de TypeScript no futuro, sem alterar os casos de uso.
- Melhor separação de responsabilidades entre parsing, consulta da AST e aplicação de regras.

## Arquivos adicionados

- `src/domain/ast/sourceAst.ts`
- `src/domain/ast/regexSourceAstBuilder.ts`
- `src/domain/ast/index.ts`
- `test/astBuilder.test.mjs`
- `docs/AST_BUILDER_REFACTORING_SUMMARY.md`

## Arquivos alterados

- `src/domain/architectureRules.ts`
- `src/domain/index.ts`

## Validação

- `npm test`: 33 testes aprovados.
- `npm run compile`: build da extensão e da webview concluído.
