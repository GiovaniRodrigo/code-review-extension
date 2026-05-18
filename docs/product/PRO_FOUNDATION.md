# Pro Foundation

## Git Code Review 2.5.0

---

## Objetivo

A versão **2.5.0 — Pro Foundation** inicia o empacotamento monetizável do Git Code Review para **code reviewers profissionais**.

O foco é entregar produtividade individual com IA cloud, relatórios e artefatos exportáveis, sem depender ainda de billing, login, colaboração Team ou governança Enterprise.

---

## Público-alvo

| Público | Necessidade |
|---|---|
| Code reviewers profissionais | Revisar PRs mais rápido com contexto e evidência técnica |
| Tech leads individuais | Gerar relatórios e resumir riscos técnicos |
| Freelancers/consultores | Produzir artefatos de revisão para clientes |
| Maintainers | Gerar PR summaries, relatórios e histórico local por branch |

---

## Escopo implementado

| Recurso | Entrega |
|---|---|
| Cloud AI Provider | Configuração de OpenAI, Gemini, Claude e endpoint customizado |
| Provider Health Check | Teste de conexão do provider ativo |
| PR Summary avançado | Resumo de PR com overview, mudanças, riscos e checklist |
| Technical Quality Report | Relatório com score, severidade, categorias e recomendações |
| Export PDF | Exportação local de relatório PDF |
| Review Templates | Templates General, Security, Architecture, Laravel, React, API, Performance e Testability |
| Review History | Histórico local de sessões por branch |
| Pro Dashboard | Painel Pro Foundation dentro do dashboard |

---

## Regras de produto

| Regra | Decisão |
|---|---|
| IA não decide aprovação | A decisão final pertence ao code reviewer |
| Cloud é opt-in | O usuário precisa configurar provider explicitamente |
| Segredos ficam seguros | API keys usam VS Code Secret Storage |
| Community continua útil | Ollama, Mock, sessões locais e Markdown continuam disponíveis |
| PDF é artefato local | Exportação não depende de backend |

---

## Comandos adicionados

```text
Code Review: Configure Cloud AI Provider
Code Review: Test AI Provider Connection
Code Review: Export Review as PDF
Code Review: Select Review Template
Code Review: Open Review History
Code Review: View Pro Features
```

---

## Próximo passo

A próxima versão comercial recomendada é:

```text
3.0.0 — Pro Commercial
```

Com foco em:

| Entrega | Objetivo |
|---|---|
| Licença local | Ativar/desativar recursos Pro |
| Login opcional | Preparar cloud sync e billing |
| Billing básico | Cobrança individual Pro |
| Limites por plano | Aplicar limites Community/Pro |
| Upgrade UX | Tela de upgrade integrada à extensão |
