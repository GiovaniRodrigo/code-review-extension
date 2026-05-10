# Code Review Design Extension

Extensão profissional para VS Code focada em **code review arquitetural**, análise de Pull Requests, comentários rastreáveis, score de qualidade e telemetria de engenharia.

## Proposta de Valor

Esta extensão ajuda equipes a revisar código com mais contexto, padronização e rastreabilidade. O foco é unir o fluxo natural do VS Code com validações de arquitetura, comentários classificados, auditoria local e métricas de qualidade.

## Principais Funcionalidades

- Dashboard de revisão com visão executiva.
- Sessões de review por branch, commit, PR ou workspace.
- Comentários vinculados a arquivo, linha, commit e sessão.
- Classificação por severidade, categoria, status e decisão.
- Validações automáticas de SOLID, DDD e Clean Architecture.
- Score de qualidade baseado em severidade, recorrência e correção.
- Integração com Git e abertura de arquivos no VS Code.
- Colaboração com mensagens, menções e aprovações parciais.
- Bloqueio de merge quando há findings críticos ou altos pendentes.
- Auditoria local, exportação, backup e sincronização remota.
- Onboarding guiado para novos usuários.

## Fluxo de Uso

1. Abra o ícone **Code Review** na Activity Bar.
2. Inicie uma nova sessão de revisão.
3. Navegue por commits, arquivos alterados e findings.
4. Adicione comentários classificados por severidade e status.
5. Acompanhe o score e as pendências no dashboard.
6. Finalize a revisão como aprovada, ajustes solicitados ou reprovada.
7. Exporte auditoria ou backup quando necessário.

## Comandos

| Comando | Atalho | Finalidade |
|---|---:|---|
| Code Review: Abrir Dashboard | `Ctrl+Alt+R` | Abre a visão principal |
| Code Review: Iniciar Revisão | `Ctrl+Alt+Shift+R` | Cria uma sessão de revisão |
| Code Review: Abrir Pull Request | — | Abre fluxo de PR |
| Code Review: Exportar Auditoria | `Ctrl+Alt+E` | Exporta trilha de auditoria |
| Code Review: Exportar Banco Local | `Ctrl+Alt+D` | Exporta persistência local |
| Code Review: Criar Backup | `Ctrl+Alt+B` | Cria backup da base local |
| Code Review: Sincronizar Remoto | `Ctrl+Alt+S` | Sincroniza dados remotos |

## Validação da versão

Esta versão foi validada com:

```bash
npm test
npm run compile
```

Resultado validado: **40 testes passando** e build completo da extensão/Webview.

## Arquitetura

O projeto segue princípios de Clean Architecture:

- `domain`: entidades, regras de negócio e validações.
- `application`: casos de uso e orquestração.
- `infrastructure`: Git, VS Code API, persistência e integrações.
- `presentation`: Webview React com Material Design 3 e experiência integrada ao VS Code.

## Documentação importante

- `docs/MARKET_READY_PLAN.md`
- `docs/FUNCTIONAL_REQUIREMENTS_MARKET.md`
- `docs/ROADMAP.md`
- `docs/BUSINESS_RULES.MD`
- `docs/design/UI_UX_GUIDELINES.md`

## Licença

MIT © 2026 Code Review Team
