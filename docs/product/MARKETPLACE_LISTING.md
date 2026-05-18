# Marketplace Listing

## Nome

```text
Git Code Review
```

## Descrição curta

```text
A code review governance workspace for reviewers inside VS Code.
```

## Descrição longa

Git Code Review ajuda code reviewers a revisar mudanças de código dentro do VS Code com contexto Git, diagnósticos técnicos, IA assistiva, RAG local/cloud e fluxo Human-in-the-Loop.

A extensão centraliza dashboard, findings, comentários, score de qualidade, análise de branch/workspace, PR summary e diagnósticos de produção para apoiar a decisão do reviewer.

## Público-alvo

```text
Code reviewers, tech leads, maintainers and engineering teams.
```

## Diferenciais para Marketplace

| Diferencial | Mensagem |
|---|---|
| Reviewer-first | Designed for the person approving or blocking changes |
| Human-in-the-Loop | AI suggests; reviewers decide |
| Git context | Review current file, workspace, branch commits and PRs |
| Local-first | Use Mock/Ollama locally before using cloud providers |
| RAG | Index repository context for better AI review |
| Diagnostics | Validate workspace, Git, AI, RAG and extension runtime |
| Product plans | Community, Pro, Team and Enterprise packaging defined |

## Screenshots

| Tela | Arquivo |
|---|---|
| Dashboard | `media/screenshots/dashboard.png` |
| Diagnostics | `media/screenshots/diagnostics.png` |

## Tags

```text
code review, git, pull request, ai, rag, ollama, quality, governance, technical debt, human in the loop
```

## Quickstart

1. Install the extension.
2. Open the Code Review activity bar.
3. Run **Code Review: Start Review**.
4. Run **Guided Setup** or use the default offline Mock provider.
5. Run **Index Repository RAG**.
6. Run **Analyze Workspace** or **Analyze Branch Commits**.
7. Review findings, approve, reply, copy or refactor.
8. Generate PR summary or technical quality report.

## Production claim

O pacote só deve ser publicado quando o comando abaixo passar:

```bash
npm run product:release
```
