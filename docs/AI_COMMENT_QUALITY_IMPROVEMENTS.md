# Melhorias de Qualidade dos Comentários IA

## Objetivo

Refinar a geração real de comentários técnicos por IA local, reduzindo demora, verbosidade e ruído visual.

## Alterações aplicadas

- Prompt técnico mais restritivo para code review.
- Limite de contexto para no máximo 3 arquivos relevantes.
- Redução de contexto para evitar envio excessivo ao Ollama.
- Limite de resposta do modelo com `num_predict`.
- Temperatura reduzida para respostas mais objetivas.
- Timeout de geração separado do timeout de detecção do provider.
- Cache simples por hash de modelo + contexto reduzido.
- Parser aceita JSON objeto ou array.
- Fallback para resposta não estruturada com texto curto.
- Comentários IA com corpo mais curto e justificativa separada.
- UI separa visualmente comentário humano e sugestão IA.
- Badge `IA` nos comentários gerados automaticamente.

## Fluxo atual

```text
Run Review
  ↓
ContextReducer
  ↓
Prompt técnico curto
  ↓
Ollama local
  ↓
Parser JSON seguro
  ↓
CommentStore
  ↓
Comments / Intelligence UI
```

## Regra de produto

A IA gera sugestões. O humano valida, edita, aprova ou descarta.
