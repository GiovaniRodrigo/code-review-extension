# Controle de Evolução — Plataforma Multi-IDE de Code Review com IA

## Objetivo

Este documento controla a evolução contínua do software após a estabilização arquitetural e dos quality gates.

O objetivo agora NÃO é mais atingir cobertura ou estabilização estrutural.

O objetivo agora é:

- evolução segura;
- desenvolvimento incremental;
- estabilidade de runtime;
- maturidade de produto;
- qualidade contínua;
- governança técnica;
- prevenção de regressões;
- evolução funcional orientada a testes.

---

# Estado Atual do Projeto

| Área | Estado |
|---|---|
| Arquitetura | 🟢 Estável |
| Quality Gates | 🟢 Estável |
| Coverage | 🟢 Aprovado |
| Mutation Testing | 🟢 Ativo |
| Multi-IDE | 🟢 Consolidado |
| Dependency Validation | 🟢 Estável |
| Runtime Diagnostics | 🟡 Em evolução |
| UX Runtime | 🟡 Em refinamento |
| Features de Produto | 🔵 Próxima fase |

---

# Regra Principal

## O projeto entrou em:

```txt
Fase de Evolução Controlada
```

e NÃO mais:

```txt
Fase de Estabilização Arquitetural
```

---

# Regras Obrigatórias de Evolução

## Toda nova feature DEVE:

- possuir teste;
- respeitar boundaries;
- preservar quality gates;
- preservar arquitetura;
- preservar coverage mínimo;
- preservar mutation threshold;
- preservar dependency validation.

---

# Todo bug encontrado DEVE:

1. gerar teste que reproduz o bug;
2. somente depois ser corrigido;
3. manter regressão protegida.

---

# PROIBIDO

## NÃO:

- quebrar boundaries;
- ignorar testes;
- diminuir thresholds;
- adicionar acoplamento entre layers;
- adicionar lógica na UI;
- acessar infraestrutura diretamente do domínio;
- criar bypass de quality gate;
- desabilitar mutation testing;
- criar hotfix sem teste.

---

# Fluxo Oficial de Desenvolvimento

# 1. Nova funcionalidade

## Fluxo obrigatório

```txt
Requisito
  ↓
Teste
  ↓
Implementação
  ↓
Quality
  ↓
Validação Runtime
```

---

# 2. Correção de bug

## Fluxo obrigatório

```txt
Bug encontrado
  ↓
Teste reproduzindo bug
  ↓
Correção
  ↓
Quality
  ↓
Homologação manual
```

---

# 3. Refatoração

## Fluxo obrigatório

```txt
Refatoração
  ↓
Todos testes verdes
  ↓
Quality gates verdes
  ↓
Mutation não degradado
```

---

# Pipeline Obrigatório

## Todo desenvolvimento DEVE passar:

```bash
npm run quality
```

---

# O pipeline quality DEVE validar

| Gate | Obrigatório |
|---|---|
| ESLint | ✅ |
| Build | ✅ |
| Unit Tests | ✅ |
| Integration Tests | ✅ |
| UI Tests | ✅ |
| E2E | ✅ |
| Coverage | ✅ |
| Mutation Testing | ✅ |
| Dependency Validation | ✅ |
| Runtime Diagnostics | ✅ |

---

# Fluxo de Runtime

## Toda feature visual DEVE validar:

| Validação | Obrigatória |
|---|---|
| Painel abre corretamente | ✅ |
| Sem erro no Extension Host | ✅ |
| Sem duplicated registration | ✅ |
| Sem erro no console | ✅ |
| Sem erro visual inesperado | ✅ |
| Sem crash de webview | ✅ |
| Sem loop infinito | ✅ |

---

# Critérios de Runtime

## Runtime NÃO pode apresentar:

```txt
Cannot register
already registered
UnhandledPromiseRejection
Extension host terminated
command not found
view already registered
```

---

# Runtime Warnings

## Dependências opcionais

Exemplo:

```txt
vscode.git
```

NÃO devem:

- quebrar runtime;
- gerar finding visual;
- gerar popup crítico;
- impedir inicialização.

---

# Padrão de Tratamento

## Correto

```txt
debug log
output channel
safe fallback
```

## Incorreto

```txt
throw fatal
popup crítico
finding visual
```

---

# Estratégia de Testes

# 1. Unitário

## Usar para

- regras;
- entidades;
- builders;
- parsers;
- adapters simples;
- transformers.

---

# 2. Integração

## Usar para

- orchestration;
- providers;
- RAG;
- pipelines;
- storage;
- indexing;
- session restore.

---

# 3. Runtime Diagnostics

## Usar para

- Extension Host;
- runtime real;
- duplicated registration;
- VSCode APIs;
- activation lifecycle.

---

# 4. E2E

## Usar para

- fluxo completo do usuário;
- análise de código;
- findings;
- navegação;
- webviews;
- comandos.

---

# Estratégia de Coverage

## Coverage NÃO é objetivo final.

Coverage é:

```txt
indicador de proteção contra regressão
```

---

# Regra

## NÃO aumentar coverage artificialmente.

---

# Correto

- testar comportamento real;
- testar runtime real;
- testar fluxos reais;
- testar falhas reais.

---

# Incorreto

- snapshot vazio;
- teste artificial;
- mock excessivo;
- smoke test sem valor;
- assertions irrelevantes.

---

# Mutation Testing

## Mutation Testing é obrigatório.

Toda nova feature relevante DEVE:

- sobreviver aos mutation gates;
- não reduzir mutation score global.

---

# Mutation mínima esperada

| Área | Meta |
|---|---|
| Core | >= 80 |
| Infra | >= 70 |
| UI | >= 60 |
| Global | >= 70 |

---

# Governança Arquitetural

## Deve permanecer:

| Regra | Obrigatória |
|---|---|
| Sem circular dependencies | ✅ |
| Sem infra no domínio | ✅ |
| Sem UI no core | ✅ |
| Sem leakage entre IDEs | ✅ |
| Sem duplicated registrations | ✅ |
| Bootstrap centralizado | ✅ |

---

# Estratégia de Commits

## Preferir

- commits pequenos;
- commits incrementais;
- feature isolada;
- bug isolado;
- testes juntos da feature.

---

# Estrutura recomendada

## Exemplo correto

```txt
feat(rag): add graph search support
test(rag): add graph search integration tests
fix(runtime): prevent duplicated configuration registration
```

---

# Homologação Manual Obrigatória

## Antes de merge/release validar:

| Validação | Obrigatória |
|---|---|
| Abrir Extension Host | ✅ |
| Abrir Dashboard | ✅ |
| Abrir Sidebar | ✅ |
| Rodar análise IA | ✅ |
| Navegar findings | ✅ |
| Aprovar findings | ✅ |
| Reiniciar VSCode | ✅ |
| Trocar branch | ✅ |
| Testar sem Git | ✅ |
| Testar provider offline | ✅ |

---

# Estado Esperado do Projeto

O projeto deve permanecer:

```txt
Enterprise-grade multi-IDE platform
```

com:

- evolução incremental;
- governança técnica;
- runtime estável;
- quality gates ativos;
- mutation testing ativo;
- arquitetura desacoplada;
- integração contínua saudável.

---

# Indicadores de Saúde do Projeto

| Indicador | Estado Esperado |
|---|---|
| Quality Pipeline | Verde |
| Runtime Diagnostics | Verde |
| Coverage | Acima do threshold |
| Mutation Score | Acima do threshold |
| Dependency Validation | Sem violações |
| Runtime UX | Sem erros críticos |
| Extension Host | Estável |
| Build Pipeline | Estável |

---

# Regra Final

Toda evolução futura do projeto deve priorizar:

```txt
segurança de evolução
```

e NÃO:

```txt
velocidade sem proteção
```