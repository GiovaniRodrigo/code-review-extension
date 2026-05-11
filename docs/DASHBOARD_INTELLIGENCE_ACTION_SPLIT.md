# Separação entre Dashboard e Intelligence

## Decisão

O botão principal do Dashboard deixa de executar IA.

- Dashboard: cria/inicia sessão de review.
- Intelligence: gera comentários técnicos com IA.

## Motivo

`Run Review` misturava duas responsabilidades: criação de sessão e execução de IA.
Agora o fluxo fica mais claro e alinhado à arquitetura:

```text
Dashboard -> Nova Sessão -> sessão ativa
Intelligence -> Gerar comentários IA -> Ollama -> comentários técnicos
```

## Critérios de UX

- A ação de criar sessão aparece no Dashboard.
- A ação de gerar comentários IA aparece no mesmo posicionamento visual em Intelligence.
- Se não houver sessão ativa, Intelligence bloqueia a geração e orienta o usuário.
- O texto `Run Review` não deve mais ser o CTA principal do Dashboard.
