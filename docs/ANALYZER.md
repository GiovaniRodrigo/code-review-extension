# Analyzer Engine

## Objetivo

Centralizar diagnósticos, score, riscos e sugestões de comentários.

## Implementação inicial

- `AnalyzerEngine`
- `ArchitectureAnalyzer`

## Entrada

```text
ReviewContext + Graph
```

## Saída

- diagnósticos;
- sugestões de comentários;
- score;
- riscos.

## Regra

Toda sugestão automatizada deve exigir validação humana antes de virar comentário oficial.
