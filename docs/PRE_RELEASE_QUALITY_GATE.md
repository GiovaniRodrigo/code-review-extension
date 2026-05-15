# PRE_RELEASE_QUALITY_GATE.md

# Objetivo

Este documento define o processo obrigatório antes de:

- gerar `.vsix`;
- criar tag;
- publicar release;
- publicar no Visual Studio Marketplace.

---

# REGRA PRINCIPAL

NENHUMA versão deve ser publicada sem:

```txt
quality gate completo
```

---

# OBJETIVO

Garantir que:

- a extensão esteja estável;
- o runtime não esteja quebrado;
- a UX principal funcione;
- o workflow HITL esteja íntegro;
- o RAG não degrade performance;
- a IA não quebre a IDE;
- a release seja reproduzível.

---

# ORDEM OBRIGATÓRIA

# 1. TESTES UNITÁRIOS

## Executar

```bash
npm run test
```

ou equivalente do monorepo.

---

# Validar

| Critério | Obrigatório |
|---|---|
| todos os testes passam | SIM |
| sem testes flaky | SIM |
| sem timeout | SIM |
| sem erros de import | SIM |
| sem warnings críticos | SIM |

---

# 2. TESTES DE INTEGRAÇÃO

## Validar obrigatoriamente

| Fluxo | Obrigatório |
|---|---|
| analyze command | SIM |
| approve finding | SIM |
| diagnostics inline | SIM |
| branch switching | SIM |
| restore session | SIM |
| revalidation | SIM |
| RAG indexing | SIM |
| RAG retrieval | SIM |
| provider retry | SIM |
| provider timeout | SIM |
| cancelamento AbortController | SIM |

---

# 3. QUALITY GATE

# Executar

## Lint

```bash
npm run lint
```

---

## Typecheck

```bash
npm run typecheck
```

---

## Build

```bash
npm run build
```

---

## Coverage

```bash
npm run test:coverage
```

---

# Critérios obrigatórios

| Área | Obrigatório |
|---|---|
| lint sem erro | SIM |
| types sem erro | SIM |
| build sem erro | SIM |
| testes passando | SIM |
| coverage aceitável | SIM |

---

# REGRA

A LLM deve:

```txt
corrigir apenas falhas reais detectadas
```

e NÃO:

```txt
refatorar sem necessidade
```

---

# 4. TESTES MANUAIS

# Obrigatório

## Instalação limpa

Validar:

| Cenário | Obrigatório |
|---|---|
| instalar .vsix | SIM |
| ativação extensão | SIM |
| sidebar abre | SIM |
| comandos aparecem | SIM |
| configurações aparecem | SIM |

---

# Workflow HITL

| Cenário | Obrigatório |
|---|---|
| análise IA | SIM |
| approve finding | SIM |
| diagnostics aparecem | SIM |
| focus finding | SIM |
| copy finding | SIM |

---

# Sessões

| Cenário | Obrigatório |
|---|---|
| trocar branch | SIM |
| restore automático | SIM |
| reload VSCode | SIM |
| reopen workspace | SIM |

---

# RAG

| Cenário | Obrigatório |
|---|---|
| index repository | SIM |
| retrieval contextual | SIM |
| limite contexto | SIM |
| skip arquivos grandes | SIM |

---

# IA

| Cenário | Obrigatório |
|---|---|
| Ollama online | SIM |
| OpenAI online | SIM |
| provider offline | SIM |
| timeout IA | SIM |
| retry IA | SIM |
| JSON inválido | SIM |

---

# 5. PERFORMANCE CHECK

# Validar

| Cenário | Obrigatório |
|---|---|
| projeto grande | SIM |
| muitos findings | SIM |
| reload rápido | SIM |
| troca rápida branch | SIM |
| múltiplas análises | SIM |

---

# Medir

| Métrica | Obrigatório |
|---|---|
| tempo análise | SIM |
| tempo indexação | SIM |
| quantidade chunks | SIM |
| memória VSCode | SIM |

---

# REGRA

A LLM NÃO deve:

```txt
otimizar sem profiling real
```

---

# 6. HARDENING CHECK

# Validar

| Cenário | Obrigatório |
|---|---|
| diagnostics órfãos | NÃO |
| listeners duplicados | NÃO |
| subscriptions vazando | NÃO |
| timers vazando | NÃO |
| webview quebrando | NÃO |
| sessões duplicadas | NÃO |

---

# 7. RELEASE CHECK

# Validar package.json

| Campo | Obrigatório |
|---|---|
| version | SIM |
| displayName | SIM |
| publisher | SIM |
| engines.vscode | SIM |
| repository | SIM |
| icon | SIM |

---

# Validar docs

| Documento | Obrigatório |
|---|---|
| README.md | SIM |
| CHANGELOG.md | SIM |
| QUICKSTART.md | SIM |
| TROUBLESHOOTING.md | SIM |
| RELEASE_CHECKLIST.md | SIM |

---

# Validar assets

| Asset | Obrigatório |
|---|---|
| screenshots | SIM |
| ícone | SIM |
| GIF workflow | RECOMENDADO |

---

# 8. GERAR RELEASE

# Somente após tudo verde

## Gerar pacote

```bash
npm run package:vscode
```

---

# Validar

| Critério | Obrigatório |
|---|---|
| .vsix gerado | SIM |
| instalação limpa | SIM |
| extensão ativa | SIM |
| workflow funcional | SIM |

---

# 9. TAG E VERSIONAMENTO

# Recomendado

## Criar tag

```bash
git tag v2.0.0
git push origin v2.0.0
```

---

# Marketplace

## Publicar somente após:

| Critério | Obrigatório |
|---|---|
| quality gate completo | SIM |
| testes manuais completos | SIM |
| release checklist completo | SIM |
| .vsix validado | SIM |

---

# PROIBIDO

NÃO publicar:

| Problema | Proibido |
|---|---|
| lint quebrado | SIM |
| typecheck quebrado | SIM |
| testes falhando | SIM |
| diagnostics inconsistentes | SIM |
| listeners vazando | SIM |
| restore quebrado | SIM |
| provider quebrando runtime | SIM |

---

# IMPLEMENTAÇÃO COM MENOR CUSTO POSSÍVEL

A LLM deve:

| Estratégia | Obrigatório |
|---|---|
| corrigir apenas falhas reais | SIM |
| evitar refatoração ampla | SIM |
| alterar menor delta possível | SIM |
| reutilizar estrutura atual | SIM |
| não trocar arquitetura | SIM |

---

# OBJETIVO FINAL

Garantir que:

```txt
a release publicada seja estável,
reproduzível
e confiável para uso diário
```

antes de:

```txt
publicar no VS Code Marketplace
```