# Notification Strategy — Plataforma Multi-IDE de Code Review com IA

# Objetivo

Definir a estratégia oficial de notificações do sistema.

O objetivo NÃO é apenas:

```txt
mostrar alertas
```

O objetivo é:

```txt
comunicar eventos relevantes sem interromper o reviewer
```

---

# Princípio Principal

As notificações devem ser:

- contextuais;
- discretas;
- úteis;
- acionáveis;
- não intrusivas.

---

# O sistema NÃO deve

- gerar spam visual;
- abrir popups excessivos;
- interromper digitação;
- interromper review;
- poluir a IDE.

---

# Tipos de Notificação

# 1. Findings

## Eventos

| Evento | Obrigatório |
|---|---|
| novo finding | ✅ |
| finding corrigido | ✅ |
| finding reaberto | ✅ |
| finding aprovado | ✅ |

---

# 2. Colaboração

## Eventos

| Evento | Obrigatório |
|---|---|
| comentário respondido | ✅ |
| review atualizado | ✅ |
| revalidação necessária | ✅ |

---

# 3. Runtime

## Eventos

| Evento | Obrigatório |
|---|---|
| provider offline | ✅ |
| sync failure | ✅ |
| runtime diagnostics | ✅ |
| timeout | ✅ |

---

# Runtime Notifications NÃO devem

- aparecer como findings;
- interromper fluxo principal;
- gerar modal bloqueante.

---

# Estratégia Correta

## Usar

- badges;
- status indicators;
- toasts discretos;
- output channel;
- logs silenciosos.

---

# Estratégia Incorreta

## NÃO usar

- popup crítico excessivo;
- modal bloqueante;
- erro fatal visual;
- spam de mensagens.

---

# Severidade de Notificação

| Severidade | Objetivo |
|---|---|
| INFO | contexto leve |
| WARNING | atenção necessária |
| ERROR | falha recoverable |
| CRITICAL | risco de perda/instabilidade |

---

# Notificações Críticas

# Só devem ocorrer quando

- houver risco real;
- houver perda de sessão;
- houver falha grave;
- houver impossibilidade de review.

---

# Runtime Errors

# O usuário NÃO deve ver

```txt
Cannot register
already registered
UnhandledPromiseRejection
```

---

# Dependências Opcionais

## Exemplos

- vscode.git;
- provider cloud;
- embeddings remotos.

---

# Dependências opcionais NÃO devem

- gerar erro crítico;
- impedir funcionamento local.

---

# Estratégia de Agrupamento

# O sistema deve agrupar

| Tipo | Obrigatório |
|---|---|
| findings similares | ✅ |
| runtime warnings | ✅ |
| sync events | ✅ |

---

# Objetivo

Evitar:

```txt
spam de notificações
```

---

# Notificações de IA

# Devem informar

| Informação | Obrigatória |
|---|---|
| provider ativo | ✅ |
| progresso | ✅ |
| timeout | ✅ |
| retry | ✅ |

---

# Notificações de Sync

# Devem informar

| Evento | Obrigatório |
|---|---|
| sincronização concluída | ✅ |
| falha recoverable | ✅ |
| conflito | ✅ |
| reconnect | ✅ |

---

# UX das Notificações

# O reviewer deve conseguir

| Ação | Obrigatória |
|---|---|
| ignorar | ✅ |
| minimizar | ✅ |
| revisar depois | ✅ |
| navegar rapidamente | ✅ |

---

# Objetivo Final

A estratégia deve evoluir como:

```txt
Camada Inteligente de Comunicação Contextual
```

e NÃO como:

```txt
sistema intrusivo de alertas
```