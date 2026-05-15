# Product Vision — Plataforma Multi-IDE de Code Review com IA

## Objetivo

Construir uma plataforma de code review integrada diretamente à IDE, permitindo que revisores realizem todo o fluxo de revisão sem depender exclusivamente de interfaces web externas.

O sistema deve utilizar IA como mecanismo de auxílio ao reviewer, mantendo obrigatoriamente o modelo HITL (Human In The Loop).

A IA nunca substitui o reviewer.

A IA auxilia o reviewer.

---

# Público Alvo

O sistema é voltado para:

- code reviewers;
- desenvolvedores senior;
- tech leads;
- arquitetos de software;
- engenheiros de software;
- equipes técnicas;
- squads de desenvolvimento;
- empresas de software.

---

# Dor Principal

O processo tradicional de code review possui fricções:

- necessidade de sair da IDE;
- dependência de plataformas web;
- perda de contexto técnico;
- review desconectado do código;
- dificuldade de comunicação iterativa;
- pouca rastreabilidade contextual;
- baixa integração com arquitetura do projeto.

O objetivo do sistema é resolver isso permitindo:

```txt
Code Review dentro da própria IDE
```

---

# Visão do Produto

O sistema deve funcionar como:

```txt
Enterprise AI Code Review Platform
```

com:

- IA assistiva;
- workflow comunicacional;
- integração com controle de versão;
- sincronização incremental;
- RAG contextual;
- heurísticas configuráveis;
- arquitetura multi-IDE;
- funcionamento offline-first;
- sincronização opcional em nuvem.

---

# Diferenciais do Produto

## 1. IA integrada ao Code Review

A IA deve auxiliar o reviewer:

- identificando possíveis problemas;
- gerando pré-validações;
- sugerindo correções;
- identificando não conformidades;
- analisando arquitetura;
- analisando contexto.

---

## 2. Findings integrados à IDE

As não conformidades devem aparecer diretamente na IDE:

- painel lateral;
- destaque no código;
- navegação por linha;
- agrupamento por severidade;
- agrupamento por reviewer;
- agrupamento por status.

---

## 3. Heurísticas customizáveis

O sistema deve permitir:

- regras customizadas;
- padrões internos;
- convenções da equipe;
- arquitetura organizacional;
- critérios de review;
- políticas de qualidade.

Tudo deve ser configurável.

---

## 4. Tudo opcional e configurável

O usuário deve decidir:

- usar IA ou não;
- usar RAG ou não;
- usar cloud ou não;
- usar sync ou não;
- usar heurísticas ou não;
- usar providers locais ou remotos;
- usar workflow completo ou simplificado.

---

# HITL — Human In The Loop

## Obrigatório

A IA nunca aprova automaticamente um review.

Toda recomendação deve passar pelo reviewer humano.

O reviewer pode:

- aceitar;
- rejeitar;
- editar;
- complementar;
- responder;
- reavaliar.

---

# Modos de Code Review

O sistema deve permitir:

| Modo | Descrição |
|---|---|
| PR Review | Revisão baseada em Pull Request |
| Branch Diff Review | Revisão baseada em diferença entre branches |
| Open File Review | Revisão apenas do arquivo aberto |
| Workspace Review | Revisão contextual do workspace |

---

# Workflow Principal

## Fluxo principal do reviewer

```txt
Reviewer
 ↓
Seleciona modo de review
 ↓
Configura contexto/RAG
 ↓
Executa pré-validação IA
 ↓
Analisa findings
 ↓
Aceita/rejeita/edita recomendações
 ↓
Adiciona validações manuais
 ↓
Sincroniza com VCS
 ↓
Dev recebe feedback
 ↓
Dev responde/corrige
 ↓
Reviewer reavalia
 ↓
Fluxo continua até aceitação final
```

---

# Conversational Code Review

O code review deve funcionar como comunicação iterativa.

O reviewer envia validações.

O desenvolvedor:

- responde;
- corrige;
- marca como resolvido;
- sobe alterações.

O reviewer:

- reavalia;
- reabre;
- aprova;
- solicita novos ajustes.

---

# Lifecycle Esperado

## Findings

```txt
OPEN
↓
IN_REVIEW
↓
FIX_REQUESTED
↓
FIXED
↓
REVALIDATED
↓
APPROVED
↓
CLOSED
```

---

# Offline Mode

## Gratuito

O modo offline deve permitir:

- uso totalmente local;
- IA local;
- Ollama;
- providers locais;
- API externa com chave do usuário;
- RAG local;
- embeddings locais;
- review sem sincronização cloud.

---

# Cloud Mode

## Pago

O modo cloud deve fornecer:

- IA treinada especificamente para code review;
- sincronização em nuvem;
- histórico compartilhado;
- sessões compartilhadas;
- colaboração;
- analytics;
- dashboards;
- inteligência organizacional;
- workflows enterprise.

---

# Monetização

## Modelo Freemium

| Plano | Recursos |
|---|---|
| Free | Offline-first/local |
| Premium | Cloud AI + Sync |
| Enterprise | Workflows + Team + Analytics |

---

# RAG

O sistema deve permitir:

- configuração opcional de RAG;
- contexto organizacional;
- contexto arquitetural;
- contexto por projeto;
- markdown contextual;
- ADRs;
- convenções internas;
- documentação técnica.

---

# Objetivo da IA

A IA deve:

- auxiliar;
- contextualizar;
- acelerar review;
- identificar riscos;
- sugerir melhorias.

A IA NÃO deve:

- substituir reviewers;
- aprovar automaticamente;
- impor decisões;
- ignorar contexto organizacional.

---

# Objetivo Final

O sistema deve evoluir como:

```txt
Plataforma Inteligente de Code Review Integrada à IDE
```

com:

- IA assistiva;
- workflow colaborativo;
- comunicação técnica;
- contexto arquitetural;
- governança;
- rastreabilidade;
- sincronização;
- inteligência organizacional.