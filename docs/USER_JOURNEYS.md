# User Journeys — Plataforma Multi-IDE de Code Review com IA

# Objetivo

Definir as jornadas reais do usuário dentro da plataforma.

Este documento descreve:

- fluxos principais;
- comportamento esperado;
- comunicação entre usuários;
- sincronização;
- validações;
- lifecycle do review.

---

# Jornada Principal — Reviewer

## Objetivo

Realizar code review completo sem sair da IDE.

---

# Fluxo Principal

```txt
Abrir IDE
 ↓
Abrir extensão
 ↓
Selecionar modo de review
 ↓
Configurar contexto/RAG
 ↓
Executar pré-validação IA
 ↓
Analisar findings
 ↓
Aceitar/rejeitar/editar findings
 ↓
Adicionar comentários manuais
 ↓
Sincronizar review
 ↓
Desenvolvedor recebe feedback
```

---

# Modos de Review

## PR Review

Reviewer revisa um Pull Request.

---

## Branch Diff Review

Reviewer revisa diferenças entre branches.

---

## Open File Review

Reviewer revisa apenas o arquivo aberto.

---

## Workspace Review

Reviewer revisa contexto geral do workspace.

---

# Pré-Validação IA

## Objetivo

A IA auxilia o reviewer antes da validação final.

---

# A IA pode

- sugerir findings;
- identificar riscos;
- apontar arquitetura incorreta;
- identificar problemas de performance;
- identificar anti-patterns;
- sugerir melhorias.

---

# O reviewer pode

| Ação | Obrigatória |
|---|---|
| Aceitar finding | ✅ |
| Rejeitar finding | ✅ |
| Editar finding | ✅ |
| Complementar comentário | ✅ |
| Adicionar finding manual | ✅ |

---

# Jornada do Desenvolvedor

## Objetivo

Receber feedback técnico e responder iterativamente.

---

# Fluxo

```txt
Receber notificação
 ↓
Abrir findings
 ↓
Responder reviewer
 ↓
Corrigir código
 ↓
Subir alterações
 ↓
Reviewer revalida
```

---

# Comunicação

O processo de review deve funcionar como conversa técnica.

---

# Reviewer pode

- comentar;
- solicitar correção;
- reabrir finding;
- aprovar;
- rejeitar correção.

---

# Desenvolvedor pode

- responder;
- justificar;
- marcar como corrigido;
- solicitar nova avaliação.

---

# Revalidação

Quando alterações forem detectadas:

- findings anteriores devem permanecer;
- sistema deve identificar itens corrigidos;
- sistema deve identificar itens alterados;
- reviewer deve reavaliar apenas o necessário.

---

# Lifecycle de Findings

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

# Jornada de Configuração RAG

## Objetivo

Permitir contexto organizacional.

---

# Fluxo

```txt
Abrir configurações
 ↓
Selecionar documentos
 ↓
Selecionar markdowns
 ↓
Configurar embeddings
 ↓
Executar indexação
 ↓
Utilizar no review
```

---

# Fontes RAG

O sistema deve suportar:

- markdown;
- ADRs;
- documentação técnica;
- arquitetura;
- regras organizacionais;
- convenções;
- style guides.

---

# Jornada Offline

## Objetivo

Permitir funcionamento completo sem cloud.

---

# O usuário deve conseguir

- usar IA local;
- usar Ollama;
- usar API própria;
- usar RAG local;
- realizar review sem internet;
- sincronizar manualmente.

---

# Jornada Cloud

## Objetivo

Permitir colaboração e sincronização.

---

# Funcionalidades esperadas

- sincronização em nuvem;
- sessões compartilhadas;
- histórico;
- dashboards;
- analytics;
- workflows colaborativos.

---

# Jornada de Runtime

## O sistema deve

- abrir rapidamente;
- não bloquear IDE;
- não travar webviews;
- não gerar duplicated registrations;
- não exibir erros críticos ao usuário.

---

# Runtime Errors

## NÃO devem aparecer

```txt
Cannot register
already registered
UnhandledPromiseRejection
Extension host terminated
```

---

# Dependências opcionais

Exemplo:

```txt
vscode.git
```

não devem quebrar runtime.

---

# Jornada de Homologação

Antes de release validar:

| Validação | Obrigatória |
|---|---|
| Abrir extensão | ✅ |
| Executar review | ✅ |
| Navegar findings | ✅ |
| Aprovar findings | ✅ |
| Rejeitar findings | ✅ |
| Revalidar correções | ✅ |
| Testar offline | ✅ |
| Testar provider indisponível | ✅ |
| Testar sync | ✅ |
| Testar restart IDE | ✅ |

---

# Objetivo Final

O produto deve proporcionar:

```txt
Code Review Conversacional Integrado à IDE
```

com:

- IA assistiva;
- HITL obrigatório;
- comunicação iterativa;
- sincronização;
- contexto arquitetural;
- colaboração;
- rastreabilidade.