# IA Plugável e Comentários Automatizados

## Papel da IA

A IA atua como copiloto de code review. Ela sugere, resume, explica e prioriza, mas não decide oficialmente.

## Providers implementados neste pacote

- `LocalDeterministicAIProvider`: provider local configurável para Community.
- `PremiumAIProvider`: provider premium integrado para planos pagos.

## Fluxo de sugestão

```text
Diff → AST → Graph → Analyzer → IA → Sugestão → Humano valida
```

## Regra de governança

Toda sugestão de IA possui `requiresHumanApproval: true`.
