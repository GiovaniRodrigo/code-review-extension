# Multi-IDE Architecture — Plataforma Multi-IDE de Code Review com IA

# Objetivo

Definir a estratégia oficial multi-IDE da plataforma.

O objetivo NÃO é:

```txt
copiar implementação entre IDEs
```

O objetivo é:

```txt
garantir experiência consistente com runtime desacoplado
```

---

# Princípio Principal

Toda IDE deve funcionar como:

```txt
adapter desacoplado do core
```

---

# Objetivos da Arquitetura

Permitir:

- escalabilidade;
- desacoplamento;
- manutenção;
- extensibilidade;
- consistência funcional;
- runtime independente.

---

# IDEs Suportadas

| IDE | Prioridade |
|---|---|
| VSCode | Alta |
| JetBrains | Média |
| Vim | Média |
| Neovim | Média |
| Sublime | Baixa |

---

# Objetivo Multi-IDE

Garantir:

```txt
mesma experiência conceitual em qualquer IDE
```

---

# Estratégia Principal

# Toda IDE deve possuir

| Camada | Obrigatória |
|---|---|
| IDE Adapter | ✅ |
| Runtime Adapter | ✅ |
| UI Adapter | ✅ |
| Sync Adapter | ✅ |

---

# O Core NÃO pode depender de

- APIs específicas da IDE;
- runtime específico;
- UI específica;
- provider específico.

---

# Objetivo

Garantir:

```txt
baixo acoplamento
```

---

# Estratégia de Adapters

# Adapters devem encapsular

| Área | Obrigatória |
|---|---|
| editor APIs | ✅ |
| webviews | ✅ |
| filesystem | ✅ |
| notifications | ✅ |
| commands | ✅ |

---

# Estratégia de Runtime

# O runtime deve funcionar

- localmente;
- desacoplado;
- independente da IDE.

---

# Runtime NÃO pode

- misturar UI com domínio;
- misturar IDE APIs com core;
- acoplar providers diretamente.

---

# Estratégia de UI

# A experiência deve ser

| Característica | Obrigatória |
|---|---|
| consistente | ✅ |
| contextual | ✅ |
| incremental | ✅ |
| não intrusiva | ✅ |

---

# Estratégia de Commands

# Toda IDE deve suportar

| Command | Obrigatório |
|---|---|
| analyze review | ✅ |
| open findings | ✅ |
| revalidate findings | ✅ |
| sync review | ✅ |

---

# Estratégia de Runtime Diagnostics

# O sistema deve detectar

| Problema | Obrigatório |
|---|---|
| duplicated registrations | ✅ |
| adapter failure | ✅ |
| webview failure | ✅ |
| provider failure | ✅ |

---

# Estratégia de Webviews

# Toda IDE que suportar UI rica deve possuir

| Recurso | Obrigatório |
|---|---|
| restore state | ✅ |
| reconnect | ✅ |
| error boundary | ✅ |
| loading state | ✅ |

---

# Estratégia Offline

# Toda IDE deve funcionar

- offline;
- sem cloud;
- sem sync remoto.

---

# Estratégia Cloud

# Cloud deve adicionar

- colaboração;
- sync;
- analytics;
- inteligência organizacional.

---

# Estratégia de Testes

# Toda IDE deve possuir

| Teste | Obrigatório |
|---|---|
| runtime tests | ✅ |
| adapter tests | ✅ |
| UI tests | ✅ |
| integration tests | ✅ |

---

# Estratégia de Evolução

# Novas IDEs devem exigir

- apenas novo adapter;
- reutilização do core;
- reutilização de domínio;
- reutilização de runtime.

---

# Objetivo Final

A arquitetura deve evoluir como:

```txt
Ecossistema Desacoplado Multi-IDE
```

e NÃO como:

```txt
implementações duplicadas por IDE
```