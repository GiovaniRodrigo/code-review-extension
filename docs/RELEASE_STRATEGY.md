# Release Strategy — Plataforma Multi-IDE de Code Review com IA

# Objetivo

Definir a estratégia oficial de releases da plataforma.

O objetivo NÃO é apenas:

```txt
publicar versões
```

O objetivo é:

```txt
garantir evolução segura, incremental e estável
```

---

# Estratégia Principal

Toda release deve preservar:

- estabilidade;
- runtime;
- arquitetura;
- quality gates;
- compatibilidade;
- experiência do reviewer.

---

# Tipos de Release

| Tipo | Objetivo |
|---|---|
| Patch | correções pequenas |
| Minor | novas funcionalidades |
| Major | mudanças estruturais/importantes |

---

# Estratégia de Versionamento

## Utilizar

```txt
Semantic Versioning
```

---

# Estrutura esperada

```txt
MAJOR.MINOR.PATCH
```

---

# Exemplos

| Versão | Tipo |
|---|---|
| 2.0.1 | patch |
| 2.1.0 | minor |
| 3.0.0 | major |

---

# Estratégia de Branches

# Branches principais

| Branch | Objetivo |
|---|---|
| main | produção |
| develop | integração |
| feat/* | feature |
| fix/* | correção |
| hotfix/* | correção urgente |

---

# Estratégia de Merge

## Todo merge deve passar

```bash
npm run quality
```

---

# Quality Gates Obrigatórios

| Gate | Obrigatório |
|---|---|
| ESLint | ✅ |
| Build | ✅ |
| Unit Tests | ✅ |
| Integration Tests | ✅ |
| Runtime Diagnostics | ✅ |
| E2E | ✅ |
| Coverage | ✅ |
| Mutation Testing | ✅ |
| Dependency Validation | ✅ |

---

# Runtime Validation

# Toda release deve validar

| Validação | Obrigatória |
|---|---|
| abrir IDE | ✅ |
| abrir extensão | ✅ |
| executar review | ✅ |
| findings funcionando | ✅ |
| sync funcionando | ✅ |
| providers funcionando | ✅ |
| runtime sem erro crítico | ✅ |

---

# Runtime NÃO pode apresentar

```txt
Cannot register
already registered
UnhandledPromiseRejection
Extension host terminated
```

---

# Estratégia de Compatibilidade

# O sistema deve preservar

| Compatibilidade | Obrigatória |
|---|---|
| sessões locais | ✅ |
| heurísticas | ✅ |
| RAG local | ✅ |
| findings | ✅ |
| providers | ✅ |

---

# Estratégia Multi-IDE

# Releases devem validar

| IDE | Obrigatória |
|---|---|
| VSCode | ✅ |
| JetBrains | ⚪ |
| Vim | ⚪ |
| Neovim | ⚪ |
| Sublime | ⚪ |

---

# Estratégia de Runtime

# Releases NÃO podem

- degradar performance;
- travar IDE;
- aumentar consumo excessivamente;
- quebrar runtime.

---

# Estratégia de Rollback

# O sistema deve permitir

| Recurso | Obrigatório |
|---|---|
| rollback rápido | ✅ |
| restore de sessão | ✅ |
| restore de configuração | ✅ |

---

# Estratégia de Observabilidade

# Releases devem monitorar

| Métrica | Obrigatória |
|---|---|
| runtime health | ✅ |
| crashes | ✅ |
| provider failures | ✅ |
| sync failures | ✅ |
| performance | ✅ |

---

# Estratégia de Feature Flags

# O sistema deve permitir

| Recurso | Obrigatório |
|---|---|
| ativar feature | ✅ |
| desativar feature | ✅ |
| rollout gradual | ⚪ |
| beta features | ⚪ |

---

# Estratégia de Releases Enterprise

# Releases enterprise devem permitir

| Recurso | Obrigatório |
|---|---|
| canais estáveis | ⚪ |
| canais beta | ⚪ |
| políticas organizacionais | ⚪ |
| controle corporativo | ⚪ |

---

# Estratégia de Hotfix

# Hotfix deve

- possuir teste;
- passar quality;
- validar runtime;
- preservar arquitetura.

---

# Objetivo Final

A estratégia deve evoluir como:

```txt
Pipeline Seguro de Evolução Incremental
```

e NÃO apenas:

```txt
processo simples de publicação
```