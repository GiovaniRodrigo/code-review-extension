# Plano 100% Mercado — Code Review Design Extension

## Objetivo

Deixar a extensão competitiva para uso real por equipes, com fluxo de revisão rápido, integração forte com VS Code, rastreabilidade, diagnósticos, score de qualidade e base para publicação no Marketplace.

## Prioridades de Mercado

1. Estabilidade de build, testes e empacotamento.
2. Fluxo central de revisão com commits, arquivos, comentários e status.
3. Comentários profissionais vinculados a arquivo, linha, commit e sessão.
4. Integração Git/PR e abertura de arquivos no VS Code.
5. Diagnóstico automático usando Problems, testes e regras arquiteturais.
6. Score de qualidade baseado em severidade, recorrência e tempo de correção.
7. Dashboard executivo com métricas claras.
8. Onboarding guiado para novos usuários.
9. Auditoria, persistência e exportação de evidências.
10. Documentação comercial para Marketplace.

## Estado Atual Validado

- `package.json` corrigido e válido.
- `npm test` validado com 31 testes passando.
- `npm run compile` validado com build do Webview e da extensão.
- Webview gerada em `webview-ui/dist`.
- Extensão gerada em `dist/extension.js`.

## Checklist de Release

- [x] Corrigir manifesto da extensão.
- [x] Validar testes automatizados.
- [x] Validar build do Webview.
- [x] Validar build da extensão.
- [x] Atualizar README para visão comercial.
- [x] Criar plano de mercado.
- [x] Criar checklist de requisitos funcionais.
- [x] Criar changelog.
- [ ] Publicar no VS Code Marketplace.
- [ ] Adicionar screenshots e GIFs reais sanitizados.
- [ ] Configurar CI em GitHub Actions.

## Próxima Evolução Recomendada

1. Integração real com APIs de GitHub/GitLab/Azure DevOps.
2. Comentários sincronizados com PR remoto.
3. WebSocket para colaboração em tempo real.
4. IA contextual com regras configuráveis por projeto.
5. Exportação PDF/HTML de auditoria.
