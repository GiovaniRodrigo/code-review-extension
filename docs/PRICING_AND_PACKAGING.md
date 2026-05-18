# Pricing and Packaging

## Git Code Review

Este documento define a estratégia oficial de planos, empacotamento, limites, recursos e monetização do produto **Git Code Review**.

## 1. Produto

**Git Code Review** é um workspace de governança de code review para VS Code.

Ele ajuda **code reviewers** a revisar mudanças de código com contexto Git, diagnósticos técnicos, IA assistiva, RAG, comentários, histórico, score de qualidade e fluxo Human-in-the-Loop.

A IA auxilia o processo de revisão, mas a decisão final sempre pertence ao reviewer.

## 2. Público-alvo

| Público | Papel |
|---|---|
| Code reviewers | Público-alvo principal; revisam, aprovam, rejeitam ou solicitam ajustes em mudanças de código |
| Tech Leads | Responsáveis por padrões técnicos e qualidade de entrega |
| Senior Developers | Revisores técnicos recorrentes em squads |
| Maintainers | Responsáveis por repositórios e projetos open source |
| Arquitetos | Responsáveis por governança técnica e consistência arquitetural |

## 3. Modelo comercial

```text
Community  → uso individual local e gratuito
Pro        → desenvolvedor profissional com IA/cloud e produtividade
Team       → equipes com colaboração, sessões compartilhadas e padrões
Enterprise → governança corporativa, segurança, auditoria, SSO e self-hosted
```

## 4. Princípios comerciais

| Princípio | Regra |
|---|---|
| Local-first | O plano gratuito deve funcionar localmente sem cloud obrigatória |
| Human-in-the-Loop | A IA nunca aprova ou altera código sem decisão humana |
| Freemium | Community gera adoção; Pro, Team e Enterprise monetizam produtividade, colaboração e governança |
| Anti lock-in | O usuário pode usar provider próprio, IA local e exportar informações |
| Valor progressivo | Cada plano deve desbloquear valor proporcional à maturidade do usuário ou organização |
| Segurança por padrão | Recursos corporativos devem priorizar auditoria, permissões, SSO e governança de IA |

## 5. Visão geral dos planos

| Plano | Público | Papel no produto | Modelo |
|---|---|---|---|
| Community | Code reviewer individual | Adoção e entrada no ecossistema | Gratuito |
| Pro | Code reviewer profissional | Monetização individual | Assinatura individual |
| Team | Squads e equipes | Colaboração e padronização | Assinatura por usuário |
| Enterprise | Empresas e organizações | Governança, segurança e escala | Contrato corporativo |

## 6. Community

### Definição

Plano gratuito, local-first e voltado para uso individual.

### Recursos

| Recurso | Incluído |
|---|---:|
| Extensão VS Code | Sim |
| Dashboard de review | Sim |
| Diagnósticos técnicos básicos | Sim |
| Análise de arquivo | Sim |
| Análise de workspace | Sim, limitada |
| Análise de branch | Sim |
| Findings locais | Sim |
| Approve / Reject / Copy | Sim |
| Comentários locais | Sim, básico |
| Refactor local | Sim, básico |
| Ollama/local AI | Sim |
| Mock provider | Sim |
| RAG local | Sim, básico |
| Project AI Chat | Sim, básico |
| Histórico local | Sim |
| Score de Qualidade | Sim, básico |
| Exportação Markdown | Sim |
| Cloud sync | Não |
| Sessões compartilhadas | Não |
| Dashboard de equipe | Não |
| SSO / audit logs enterprise | Não |

### Limites iniciais

| Limite | Valor |
|---|---:|
| Usuários | 1 |
| Repositórios locais | Ilimitado |
| Sessões locais | Ilimitado |
| Arquivos por análise | Até 250 |
| Reviews com IA local | Ilimitado |
| Reviews com IA cloud gerenciada | Não incluído |
| Suporte | Comunidade / GitHub Issues |

### Preço

```text
Grátis
```

## 7. Pro

### Definição

Plano para code reviewers profissionais que precisam de mais produtividade, IA cloud, histórico avançado, relatórios e análises mais completas.

### Recursos

| Recurso | Incluído |
|---|---:|
| Tudo do Community | Sim |
| IA cloud gerenciada | Sim |
| OpenAI / Gemini / Claude ou provider próprio | Sim |
| PR Summary avançado | Sim |
| Technical Quality Report | Sim |
| RAG avançado | Sim |
| Project AI Chat avançado | Sim |
| Histórico avançado | Sim |
| Configuração por projeto | Sim |
| Templates de review | Sim |
| Heurísticas customizadas básicas | Sim |
| Exportação Markdown/PDF | Sim |
| Score de Qualidade avançado | Sim |
| Analytics individual | Básico |
| Sessões compartilhadas | Não |
| Dashboard de equipe | Não |

### Limites iniciais

| Limite | Valor |
|---|---:|
| Usuários | 1 |
| Repositórios | Até 10 |
| Sessões salvas | 100/mês |
| Reviews com IA cloud | 300/mês |
| Arquivos por análise | Até 1.000 |
| Relatórios exportados | 100/mês |
| Histórico cloud | 90 dias |
| Suporte | Email básico |

### Preço sugerido

| Modelo | Valor |
|---|---:|
| Mensal | US$ 15/mês |
| Anual | US$ 150/ano |

> Preços e limites são referência inicial e devem ser validados com usuários reais.

## 8. Team

### Definição

Plano para squads, consultorias e pequenas/médias equipes que precisam compartilhar sessões de review, padronizar critérios técnicos e acompanhar qualidade por repositório.

### Recursos

| Recurso | Incluído |
|---|---:|
| Tudo do Pro | Sim |
| Sessões compartilhadas | Sim |
| Review colaborativo | Sim |
| Comentários por finding | Sim |
| Discussões técnicas | Sim |
| Histórico por branch/PR | Sim |
| Dashboard de equipe | Sim |
| Métricas por repositório | Sim |
| Heurísticas por equipe | Sim |
| Políticas de review | Sim |
| Padrões arquiteturais da equipe | Sim |
| Integração GitHub/GitLab | Sim |
| Papéis e permissões básicos | Sim |
| Analytics de equipe | Sim |
| SSO | Add-on |
| Audit logs | Básico |

### Limites iniciais

| Limite | Valor |
|---|---:|
| Usuários | 3 a 25 |
| Repositórios | Até 50 |
| Sessões compartilhadas | 1.000/mês |
| Reviews com IA cloud | 2.000/mês |
| Arquivos por análise | Até 5.000 |
| Histórico cloud | 180 dias |
| Suporte | Prioritário |

### Preço sugerido

| Modelo | Valor |
|---|---:|
| Por usuário/mês | US$ 25 |
| Por usuário/ano | US$ 250 |
| Mínimo recomendado | 3 usuários |

## 9. Enterprise

### Definição

Plano corporativo para organizações que precisam de governança, segurança, auditoria, SSO, políticas corporativas de IA e opções de implantação controlada.

### Recursos

| Recurso | Incluído |
|---|---:|
| Tudo do Team | Sim |
| SSO/SAML/OIDC | Sim |
| RBAC avançado | Sim |
| Audit logs completos | Sim |
| Políticas corporativas de IA | Sim |
| Aprovação humana obrigatória | Sim |
| Retenção customizada | Sim |
| Dashboards executivos | Sim |
| Integração Jira/Azure DevOps | Sim |
| Private cloud | Opcional |
| Self-hosted | Opcional |
| VPC deployment | Opcional |
| SLA | Sim |
| Suporte dedicado | Sim |
| Treinamento/onboarding | Sim |

### Preço sugerido

```text
Sob consulta
```

Referência inicial:

| Modelo | Valor |
|---|---:|
| Contrato anual mínimo | US$ 10.000/ano |
| Por usuário/mês | US$ 49 a US$ 99 |
| Setup/onboarding | Opcional |

## 10. Comparativo resumido

| Recurso | Community | Pro | Team | Enterprise |
|---|---:|---:|---:|---:|
| VS Code Extension | Sim | Sim | Sim | Sim |
| Review local | Sim | Sim | Sim | Sim |
| Ollama/local AI | Sim | Sim | Sim | Sim |
| Cloud AI gerenciada | Não | Sim | Sim | Sim |
| RAG local | Básico | Avançado | Avançado | Custom |
| Project AI Chat | Básico | Avançado | Avançado | Custom |
| PR Summary | Básico | Avançado | Avançado | Avançado |
| Technical Quality Report | Não | Sim | Sim | Sim |
| Histórico local | Sim | Sim | Sim | Sim |
| Histórico cloud | Não | Sim | Sim | Sim |
| Sessões compartilhadas | Não | Não | Sim | Sim |
| Dashboard de equipe | Não | Não | Sim | Sim |
| Políticas de review | Não | Não | Sim | Sim |
| SSO | Não | Não | Add-on | Sim |
| Audit logs | Não | Não | Básico | Completo |
| Self-hosted | Não | Não | Não | Opcional |
| SLA | Não | Não | Não | Sim |

## 11. Regras de upgrade

| Origem | Destino | Gatilho |
|---|---|---|
| Community | Pro | Precisa de IA cloud, histórico cloud, relatórios PDF, PR Summary avançado ou projetos maiores |
| Pro | Team | Mais de uma pessoa participa do review ou a equipe precisa de padrões compartilhados |
| Team | Enterprise | Necessidade de SSO, RBAC, audit logs completos, políticas corporativas de IA, SLA ou self-hosted |

## 12. Estratégia de lançamento

| Fase | Planos | Objetivo |
|---|---|---|
| 1 | Community + Pro | Validar adoção individual e monetização inicial |
| 2 | Team | Validar colaboração, sessões compartilhadas e padrões de equipe |
| 3 | Enterprise | Validar governança, SSO, auditoria e self-hosted com clientes piloto |

## 13. MVP comercial

O MVP comercial deve lançar **Community + Pro**.

Primeiro recurso pago recomendado:

```text
PR Summary avançado + Technical Quality Report + histórico cloud de sessões.
```

Motivo:

```text
Esses recursos entregam valor claro para code reviewers profissionais e são mais simples de monetizar antes de colaboração complexa ou governança enterprise.
```

## 14. Regra final

```text
Community gera adoção.
Pro gera receita inicial.
Team gera expansão.
Enterprise gera contratos maiores.
```

O Git Code Review deve monetizar produtividade, colaboração e governança sem bloquear o valor essencial de review local para code reviewers individuais.
