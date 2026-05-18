# AI Coding Guard

## Objetivo

O AI Coding Guard valida código gerado por LLM antes de aplicar alterações no repositório.

## Regra central

A LLM pode sugerir código, mas o code reviewer decide se o código entra no projeto.

## Fluxo

1. A LLM gera uma alteração em rascunho.
2. O reviewer abre o arquivo ou diff no VS Code.
3. O AI Coding Guard escaneia o rascunho.
4. Não conformidades são classificadas como High, Medium ou Low.
5. O reviewer pode aprovar, rejeitar, criar finding, abrir diff ou pedir para a IA corrigir.

## Categorias verificadas

| Categoria | Exemplos |
|---|---|
| Segurança | SQL inseguro, segredo hardcoded, eval/new Function |
| Arquitetura | Controller com regra de negócio, domínio dependendo de infraestrutura |
| Testabilidade | Código produtivo sem teste associado |
| Manutenibilidade | Patch grande demais para revisão segura |

## Modos

| Modo | Descrição |
|---|---|
| Advisory | Apenas alerta |
| Review Gate | Bloqueia findings críticos até decisão humana |
| Strict Policy | Preparado para políticas Team/Enterprise |

## Status

| Status | Significado |
|---|---|
| Clean | Nenhuma não conformidade bloqueante |
| Warning | Existem pontos de atenção |
| Blocked | Existe violação grave |
| Needs Review | Precisa de contexto ou ação humana |
