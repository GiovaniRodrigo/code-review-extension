# Diretrizes para Execução de IA na Extensão de IDE

Este documento define regras operacionais para chamadas de Inteligência Artificial na extensão de IDE, com foco em respostas rápidas, baixo consumo de tokens, baixo custo computacional e saídas previsíveis.

A IA deve atuar como componente auxiliar de análise, não como centro absoluto da decisão técnica.

---

# 1. Princípio Principal

A IA deve responder apenas ao que foi solicitado, usando o menor contexto suficiente.

```text
Menos contexto.
Menos etapas.
Menos explicação.
Mais objetividade.
Mais estrutura.
Mais previsibilidade.
```

---

# 2. Regras Gerais

| Regra | Descrição |
|---|---|
| R1 | Não explicar o raciocínio interno |
| R2 | Não reescrever o problema |
| R3 | Não fazer introduções longas |
| R4 | Não gerar múltiplas alternativas se uma solução for suficiente |
| R5 | Não analisar arquivos não relacionados |
| R6 | Não usar RAG quando a análise direta for suficiente |
| R7 | Não solicitar contexto adicional se o contexto mínimo já permite resposta útil |
| R8 | Não retornar Markdown quando o contrato pedir JSON |
| R9 | Não inventar regras, arquivos, classes ou dependências |
| R10 | Preferir respostas determinísticas e curtas |

---

# 3. Modos de Execução

| Modo | Uso | Thinking esperado |
|---|---|---|
| `fast` | Análise rápida de trecho pequeno | Baixo |
| `standard` | Análise comum de arquivo ou finding | Médio-baixo |
| `deep` | Refatoração, arquitetura, RAG amplo | Médio |
| `audit` | Auditoria técnica completa | Alto, somente quando solicitado |

O modo padrão deve ser `fast`.

## 3.1 Fast

Usar quando houver:

- Código pequeno
- Validação de finding
- Sugestão de correção simples
- Classificação de severidade
- Resumo curto
- Mensagem para UI

## 3.2 Standard

Usar quando:

- Um arquivo inteiro precisa ser analisado
- Existe AST disponível
- Existe contexto mínimo de regra
- A análise precisa gerar findings

## 3.3 Deep

Usar somente quando:

- O usuário pedir explicitamente análise profunda
- A análise envolver arquitetura
- A análise exigir vários arquivos
- A análise depender de RAG
- A decisão impactar refatoração grande

## 3.4 Audit

Usar somente quando:

- For uma revisão formal
- Houver requisito de compliance
- Houver quality gate crítico
- O usuário solicitar auditoria completa

---

# 4. Política de Contexto Mínimo

| Tipo de análise | Contexto máximo recomendado |
|---|---|
| Finding simples | Trecho + 20 linhas ao redor |
| Arquitetura | Imports + path + regra violada |
| SOLID | Classe ou função alvo |
| Segurança | Trecho suspeito + dependências relevantes |
| RAG | Top 3 a 5 chunks |
| AST | Nós relevantes, não AST completo |
| Testes | Teste + função testada |

---

# 5. Uso de RAG

RAG deve ser opcional e usado apenas quando agrega valor.

## 5.1 Usar RAG quando

- A análise depende de documentação do projeto.
- A regra está em ADR, README, ARCHITECTURE ou REQUIREMENTS.
- O usuário solicitar análise com contexto.
- O analyzer detectar violação de regra documentada.

## 5.2 Não usar RAG quando

- O problema é sintático.
- O erro é evidente pelo trecho.
- O analyzer já encontrou a violação.
- A resposta é apenas uma classificação simples.

---

# 6. Uso de AST

O AST deve ser usado antes da IA sempre que possível.

A IA deve receber resumo estrutural, não o código inteiro.

```json
{
  "file": "src/application/AnalyzeCodeUseCase.ts",
  "imports": ["vscode", "../domain/Finding"],
  "classes": ["AnalyzeCodeUseCase"],
  "rule": "Application não pode importar APIs de IDE",
  "suspectedViolation": "import vscode"
}
```

---

# 7. Contratos de Resposta

## 7.1 Findings

```json
{
  "findings": [
    {
      "file": "string",
      "line": 0,
      "column": 0,
      "severity": "info | warning | critical",
      "category": "architecture | solid | security | code_smell | test | dependency | rag",
      "message": "string",
      "suggestedFix": "string",
      "confidence": 0.0
    }
  ]
}
```

Regras:

- Não usar Markdown.
- Não usar comentários.
- Não usar texto fora do JSON.
- Não usar trailing comma.
- Não inventar linha se ela não foi fornecida.
- Usar `confidence` entre `0.0` e `1.0`.

## 7.2 Validação de Finding

```json
{
  "isValid": true,
  "confidence": 0.0,
  "reason": "string",
  "suggestedAction": "approve | reject | needs_review"
}
```

`reason` deve ter no máximo 240 caracteres.

## 7.3 Sugestão de Correção

```json
{
  "canAutoFix": true,
  "risk": "low | medium | high",
  "summary": "string",
  "patch": "string"
}
```

Regras:

- `patch` deve ser pequeno.
- Não alterar código fora do escopo.
- Se houver risco alto, `canAutoFix` deve ser `false`.

---

# 8. Prompts Recomendados

## 8.1 Prompt Base

```text
Você é um analisador técnico de código para uma extensão de IDE.
Responda somente no formato solicitado.
Não explique seu raciocínio.
Não use Markdown.
Não invente informações.
Use o menor número possível de palavras.
Quando não houver evidência suficiente, retorne baixa confiança.
```

## 8.2 Análise Rápida

```text
Analise o trecho abaixo e retorne apenas JSON válido.
Objetivo: identificar findings objetivos.
Não explique.
Não sugira melhorias genéricas.
Considere apenas o contexto fornecido.
```

## 8.3 Arquitetura

```text
Valide se o arquivo viola a regra arquitetural informada.
Use apenas imports, path e regra.
Retorne JSON válido.
Não explique raciocínio.
```

## 8.4 RAG

```text
Use somente os chunks fornecidos como contexto.
Não use conhecimento externo.
Se os chunks forem insuficientes, retorne confidence baixo.
Responda somente JSON válido.
```

## 8.5 AST

```text
Use a estrutura AST resumida para validar a regra.
Não peça o código completo.
Não explique.
Retorne JSON válido.
```

---

# 9. Orquestração Recomendada

```text
Código
  ↓
AST Builder
  ↓
Analyzers locais
  ↓
Filtro de evidências
  ↓
IA em modo fast ou standard
  ↓
Normalizador de JSON
  ↓
Quality Gate
  ↓
UI da IDE
```

---

# 10. Responsabilidade dos Analyzers Locais

| Analyzer | Redução de thinking |
|---|---|
| ASTAnalyzer | Envia apenas estrutura relevante |
| DependencyAnalyzer | Envia apenas dependência suspeita |
| ArchitectureAnalyzer | Envia regra + violação provável |
| SolidAnalyzer | Envia classe/função alvo |
| SecurityAnalyzer | Envia trecho suspeito |
| RagConsistencyAnalyzer | Envia apenas chunks relevantes |

---

# 11. Quality Gate

Toda resposta da IA deve passar por validação antes de chegar à UI.

Validar:

- JSON válido
- Schema correto
- Severidade permitida
- Categoria permitida
- Confidence numérico
- Linha existente
- Arquivo existente
- Mensagem curta
- Sugestão segura

---

# 12. Fallback

Se a IA falhar, o sistema não deve quebrar.

```json
{
  "findings": [],
  "error": {
    "type": "AI_RESPONSE_INVALID",
    "message": "Resposta da IA inválida ou incompleta"
  }
}
```

---

# 13. Configuração Recomendada

```json
{
  "ai": {
    "defaultMode": "fast",
    "maxContextChunks": 5,
    "maxCodeLines": 120,
    "temperature": 0.1,
    "requireJson": true,
    "allowMarkdown": false,
    "useRagByDefault": false,
    "useAstSummary": true,
    "fallbackOnInvalidJson": true
  }
}
```

---

# 14. Regras para UI

Cada finding deve exibir:

- Severidade
- Categoria
- Arquivo
- Linha
- Mensagem curta
- Botão para detalhes
- Botão para aplicar correção, se seguro

A explicação longa deve ficar oculta por padrão.

---

# 15. Critérios de Aceite

- A IA responde em JSON válido.
- O modo padrão é `fast`.
- O RAG não é usado por padrão.
- O contexto enviado é reduzido.
- A UI não depende de explicações longas.
- Os analyzers locais funcionam sem IA.
- A extensão continua funcional offline.
- O core não depende de provider concreto de IA.
