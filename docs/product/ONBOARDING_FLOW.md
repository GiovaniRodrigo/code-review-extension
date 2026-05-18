# Onboarding Flow

## Objetivo

Guiar code reviewers até o primeiro valor percebido em menos de 2 minutos.

## Jornada inicial

```text
Open VS Code
  ↓
Open Git Code Review
  ↓
Start Review
  ↓
Run Diagnostics
  ↓
Choose provider or use Mock/Ollama
  ↓
Index RAG
  ↓
Analyze Workspace or Branch
  ↓
Review Findings
  ↓
Approve / Reply / Refactor / Generate Report
```

## Primeiro CTA

```text
Start Review
```

## Regras de UX

| Regra | Descrição |
|---|---|
| Nunca deixar tela vazia | Toda view deve sugerir a próxima ação |
| Diagnóstico antes de erro | Problemas de ambiente devem aparecer no diagnostics |
| Mock como fallback | Sem provider cloud, o usuário ainda consegue explorar o produto |
| RAG opcional no início | O usuário pode analisar antes de indexar, mas deve ser incentivado a indexar |
| Reviewer decide | A UI deve reforçar que approve/reject é decisão humana |

## Empty states

| Situação | Mensagem |
|---|---|
| Sem workspace | Open a workspace to start a review |
| Sem provider | Use Mock/Ollama or configure a cloud provider |
| Sem RAG | Index repository context for better analysis |
| Sem findings | Run Analyze Workspace or Analyze Branch Commits |
| Sem histórico | Your review sessions will appear here after the first review |
