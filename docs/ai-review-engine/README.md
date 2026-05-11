
# AI Review Engine Architecture

## Objetivo

Transformar a IA textual em um motor real de engenharia de software.

## Pipeline

```text
Git Diff
  ↓
AST Parser
  ↓
Rule Engine
  ↓
Context Builder
  ↓
LLM
  ↓
Structured Findings
  ↓
Inline Comments
  ↓
Score Engine
  ↓
Dashboard
```

## Structured Findings

Cada finding deve possuir:

- severity
- category
- file
- line
- title
- description
- suggestion
- confidence

## Categorias

- architecture
- performance
- security
- clean_code
- testing
- dependency
- scalability
- maintainability
