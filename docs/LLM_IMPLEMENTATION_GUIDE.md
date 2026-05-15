# LLM Implementation Guide

## Objetivo

Implementar o sistema de Code Review com IA com o menor custo possível de raciocínio, alterações e retrabalho.

Este documento deve ser usado como entrada principal para uma LLM implementar o projeto de forma incremental, respeitando a pasta `docs`.

---

## Fonte de Verdade

Antes de implementar qualquer coisa, leia obrigatoriamente:

```txt
docs/
```

A pasta `docs` é a fonte principal de decisão do projeto.

A implementação deve seguir os documentos já existentes, especialmente:

- requisitos funcionais;
- requisitos não funcionais;
- arquitetura;
- design patterns;
- UX/UI;
- providers de IA;
- RAG;
- sessões de review;
- validação Human-in-the-Loop;
- dashboard;
- auditoria;
- multi-IDE.

---

## Regra Principal

Não reinventar o sistema.

A LLM deve:

1. localizar o documento relacionado em `docs`;
2. identificar o menor módulo afetado;
3. implementar somente o necessário;
4. preservar contratos existentes;
5. evitar refatorações amplas;
6. manter compatibilidade com a arquitetura atual;
7. criar testes mínimos para validar o comportamento.

---

## Escopo do Sistema

O sistema é uma extensão de IDE para auxiliar Code Review com IA.

Deve permitir:

- analisar código com IA;
- exibir findings na IDE;
- navegar do finding para arquivo e linha;
- marcar finding como aprovado, pendente ou resolvido;
- aplicar sugestões quando permitido;
- manter sessões por branch;
- restaurar sessão automaticamente;
- usar IA local, IA via API, IA da IDE ou IA cloud premium;
- usar RAG quando disponível;
- permitir validação humana obrigatória;
- registrar auditoria;
- exibir dashboard de revisão.

---

## Regras Obrigatórias

| Regra | Descrição |
|---|---|
| R001 | Toda análise da IA deve passar por validação humana |
| R002 | Nenhuma decisão crítica pode ser aplicada automaticamente |
| R003 | O core não pode depender diretamente do VS Code |
| R004 | Providers de IA devem ser intercambiáveis |
| R005 | Novas IDEs devem ser adicionadas por adapter |
| R006 | Novas validações devem ser adicionadas sem alterar o fluxo principal |
| R007 | A UI deve indicar claramente o que foi gerado por IA |
| R008 | Falhas da IA não podem quebrar a IDE |
| R009 | Sessões devem ser associadas à branch atual |
| R010 | O sistema deve funcionar com IA local/offline quando configurado |

---

## Estratégia de Implementação

Implementar em camadas, nesta ordem:

```txt
1. Domain
2. Application
3. Infrastructure
4. IDE Adapter
5. Presentation
6. Tests
```

Nunca começar pela UI se o comportamento de domínio ainda não existir.

---

## Módulos Prioritários

### 1. Review Session

Implementar ou revisar:

- criação de sessão;
- restauração de sessão;
- associação com branch;
- status da sessão;
- persistência local;
- histórico de ações.

Critério de aceite:

```txt
Ao trocar de branch, o sistema deve restaurar a sessão correspondente.
```

---

### 2. Findings

Implementar ou revisar:

- entidade de finding;
- severidade;
- arquivo;
- linha;
- mensagem;
- sugestão;
- status;
- origem IA;
- aprovação humana.

Critério de aceite:

```txt
O usuário deve conseguir clicar em um finding e navegar até o arquivo e linha correspondente.
```

---

### 3. AI Providers

Implementar ou revisar providers:

- local;
- API externa;
- IDE integrada;
- cloud premium;
- fallback.

Critério de aceite:

```txt
O sistema deve escolher o provider configurado e trocar para fallback em caso de falha.
```

---

### 4. RAG

Implementar ou revisar:

- indexação do repositório;
- chunking;
- embeddings;
- busca semântica;
- limpeza do índice;
- uso do contexto na análise.

Critério de aceite:

```txt
Quando houver RAG indexado, a análise deve usar contexto recuperado do repositório.
```

---

### 5. Human-in-the-Loop

Implementar ou revisar:

- aprovação de finding;
- rejeição de finding;
- pendência;
- resolução;
- auditoria da decisão humana.

Critério de aceite:

```txt
Nenhum finding crítico deve ser aplicado sem ação explícita do usuário.
```

---

### 6. Dashboard

Implementar ou revisar:

- total de findings;
- findings por severidade;
- findings por status;
- status do provider de IA;
- status do RAG;
- sessão ativa;
- branch atual.

Critério de aceite:

```txt
O dashboard deve mostrar o estado atual da revisão de forma clara.
```

---

## Contratos Esperados

A implementação deve preservar contratos parecidos com:

```txt
AIProvider
ReviewSessionRepository
FindingRepository
BranchProvider
DiffProvider
StorageProvider
RagIndexer
EmbeddingProvider
VectorStore
IdeAdapter
```

Não acoplar implementação concreta ao domínio.

---

## Fluxo Principal

```txt
Usuário executa análise
↓
Sistema identifica branch atual
↓
Sistema recupera ou cria sessão
↓
Sistema coleta diff/contexto
↓
Sistema recupera contexto RAG se existir
↓
Sistema envia para provider de IA
↓
Sistema recebe findings estruturados
↓
Sistema persiste findings
↓
Sistema exibe findings na IDE
↓
Usuário valida manualmente
↓
Sistema registra auditoria
```

---

## Estados de Finding

| Status | Descrição |
|---|---|
| pending | Encontrado, ainda não validado |
| approved | Validado pelo usuário |
| rejected | Rejeitado pelo usuário |
| resolved | Corrigido ou finalizado |
| ignored | Ignorado conscientemente |

---

## Severidades

| Severidade | Uso |
|---|---|
| info | melhoria leve ou observação |
| warning | possível problema técnico |
| critical | problema grave que exige atenção |

---

## Regras para UI

A interface deve:

- ser clara;
- evitar poluição visual;
- seguir Material Design 3 e shadcn/ui;
- mostrar loading durante análise;
- mostrar erro de provider sem quebrar a tela;
- permitir navegar até o código;
- permitir aprovar, rejeitar e resolver findings;
- mostrar badges de severidade;
- mostrar badges de status;
- mostrar provider ativo;
- mostrar se RAG está ativo ou não.

---

## Regras para IA

A IA deve retornar sempre JSON válido.

Formato mínimo esperado:

```json
{
  "findings": [
    {
      "file": "src/example.ts",
      "line": 10,
      "message": "Mensagem objetiva do problema",
      "severity": "warning",
      "suggestedFix": "Sugestão curta de correção"
    }
  ],
  "confidenceScore": 0.85
}
```

A implementação deve validar a resposta antes de persistir.

---

## Regras para Erro

| Cenário | Comportamento esperado |
|---|---|
| IA indisponível | Mostrar erro amigável |
| RAG vazio | Continuar análise sem RAG |
| JSON inválido | Rejeitar resposta e exibir erro |
| Provider falhou | Tentar fallback configurado |
| Arquivo não existe | Mostrar finding sem navegação |
| Linha inválida | Abrir arquivo sem posicionar linha |
| Sessão ausente | Criar nova sessão |

---

## Testes Mínimos

Criar testes para:

- criação de sessão;
- troca de branch;
- persistência de findings;
- alteração de status;
- provider com sucesso;
- provider com falha;
- fallback de provider;
- análise sem RAG;
- análise com RAG;
- navegação para arquivo e linha;
- validação de JSON da IA.

---

## Ordem Recomendada de Tasks

### Task 01 — Consolidar contratos

Garantir que os contratos principais existam e estejam desacoplados.

### Task 02 — Implementar sessão por branch

Garantir criação, recuperação e troca automática de sessão.

### Task 03 — Implementar findings

Garantir modelo, persistência e atualização de status.

### Task 04 — Implementar provider de IA

Garantir execução da análise e retorno estruturado.

### Task 05 — Implementar fallback

Garantir troca automática em caso de falha.

### Task 06 — Implementar RAG básico

Garantir indexação, busca e uso do contexto.

### Task 07 — Implementar UI de findings

Garantir listagem, severidade, status e navegação.

### Task 08 — Implementar HITL

Garantir aprovar, rejeitar, resolver e auditar.

### Task 09 — Implementar dashboard

Garantir visão geral da revisão.

### Task 10 — Criar testes

Garantir cobertura dos fluxos principais.

---

## Restrições

Não fazer:

- refatoração global sem necessidade;
- troca de stack;
- reescrita do projeto;
- acoplamento do core ao VS Code;
- lógica de negócio dentro da UI;
- dependência direta de provider específico;
- aplicação automática de correções críticas;
- geração de código sem teste mínimo.

---

## Critério de Conclusão

A implementação será considerada suficiente quando:

```txt
1. O usuário conseguir executar análise pela IDE.
2. A IA retornar findings estruturados.
3. Os findings forem exibidos na interface.
4. O usuário conseguir navegar até o código.
5. O usuário conseguir validar manualmente os findings.
6. A sessão for restaurada por branch.
7. O sistema funcionar com provider configurável.
8. O sistema não quebrar se a IA falhar.
9. Os principais fluxos tiverem testes.
```

---

## Instrução Final para a LLM

Implemente o menor conjunto de alterações possível.

Sempre siga esta sequência:

```txt
ler docs
identificar escopo
alterar menor módulo possível
preservar contratos
implementar comportamento
criar teste mínimo
executar validação
parar
```

Não criar novas abstrações se as existentes forem suficientes.

Não alterar arquitetura sem necessidade.

Não remover comportamento existente.

Priorizar MVP funcional antes de expansão enterprise.