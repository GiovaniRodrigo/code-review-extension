# Graph Engine

## Objetivo

O Graph Engine cria contexto arquitetural para reduzir uso de contexto em LLMs e melhorar análise de impacto.

## Implementação inicial

Arquivo principal:

```text
src/graph/LocalGraphProvider.ts
```

## Relações suportadas

- arquivo contém classe/método;
- arquivo depende de importação;
- mudança impacta dependências relacionadas.

## Evolução planejada

- graph incremental;
- persistência local;
- graph remoto premium;
- relação com comentários, diagnósticos e histórico.
