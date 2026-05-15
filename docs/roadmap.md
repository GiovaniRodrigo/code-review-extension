# Roadmap do Motor de Review de IA

## Marco MVP VS Code Utilizável
- 🟢 Extensão VS Code empacotável em `.vsix`.
- 🟢 Análise do arquivo ativo com provider `mock`, `ollama` ou `openai`.
- 🟢 Findings estruturados com severidade, status e confidence score.
- 🟢 Sidebar com estados de carregamento, erro, sessão vazia e sessão restaurada.
- 🟢 Fluxo Human-in-the-Loop para aprovar ou rejeitar findings.
- 🟢 Diagnostics inline somente após aprovação humana.
- 🟢 Persistência local e restauração por branch.
- 🟢 Comando para limpar a sessão atual.

## Fase 1: Fundamentos
- 🟢 Descobertas estruturadas (findings).
- 🟢 Comentários inline na IDE.
- 🟢 Motor de severidade.
- 🟢 Persistência de sessões reais e troca de branch.
- 🟢 Reanálise iterativa (revalidation).

## Fase 2: Inteligência Estática
- 🟢 Parser de AST (Abstract Syntax Tree).
- 🟢 Motor de regras customizáveis.
- Score de risco por arquivo/método.
- Identificação de violações SOLID automatizada.
- Grafo de dependência de código.

## Fase 3: RAG e Contexto
- 🟢 Chunking semântico.
- 🟢 Indexação de repositório local incremental.
- 🟢 Busca contextual para IA com ranking simples.
- Recuperação híbrida (Semântica + Keyword).
- Contexto organizacional (padrões do time).
- Memória de IA (contexto persistente do projeto).

## Fase 4: Enterprise e Ecossistema
- 🟢 IA multi-provedor (Hybrid Cloud/Local).
- 🟢 Sidebar operacional com agrupamento e filtros por severidade.
- 🟢 Resiliência de IA (Retries, Timeouts, Cancelamento).
- Publicação automática de PRs no GitHub/GitLab.
- Workflows corporativos e auditoria.
