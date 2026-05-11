# Workflow Engine

## Objetivo

Permitir automações configuráveis por evento.

## Implementação inicial

Arquivo:

```text
src/workflows/WorkflowEngine.ts
```

## Eventos suportados

- `review.started`
- `comment.created`
- `analysis.finished`
- `score.changed`
- `branch.changed`
- `pr.synchronized`

## Exemplo

```yaml
on:
  - review.started

actions:
  - run.ai
```
