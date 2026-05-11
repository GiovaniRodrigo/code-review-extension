# Premium Edition

## Objetivo

A versão Premium transforma a extensão em cliente colaborativo de uma plataforma paga de code review remoto.

A versão Community continua local-first. A versão Premium habilita banco remoto, colaboração entre revisores distantes, histórico organizacional e analytics corporativo.

---

## Edições

### Community

Persistência local:

- banco JSON local versionado;
- reviews locais;
- AST Builder;
- diagnósticos locais;
- TUI dos testes;
- dashboards locais;
- exportação de snapshot local.

### Premium

Persistência remota paga:

- banco remoto centralizado;
- sincronização de sessões;
- colaboração multiusuário;
- auditoria por organização;
- analytics organizacional;
- base para realtime via WebSocket/Event Bus.

---

## Regras de negócio Premium

1. Banco remoto é recurso pago.
2. A edição Community nunca exige API ou token premium.
3. A edição Premium exige `giovaniCodeReview.premiumApiUrl` e `giovaniCodeReview.premiumToken`.
4. Sessões remotas pertencem a uma organização e a um workspace.
5. O token premium nunca deve ser enviado ao dashboard.
6. A sincronização remota deve passar por contrato de aplicação, não por acoplamento direto com VS Code.
7. Em Community, `syncRemote` gera snapshot local.
8. Em Premium, `syncRemote` envia sessões para a API premium.

---

## Configurações

```json
{
  "giovaniCodeReview.edition": "community",
  "giovaniCodeReview.premiumApiUrl": "",
  "giovaniCodeReview.premiumToken": "",
  "giovaniCodeReview.organizationId": "",
  "giovaniCodeReview.workspaceId": ""
}
```

Para ativar a versão paga:

```json
{
  "giovaniCodeReview.edition": "premium",
  "giovaniCodeReview.premiumApiUrl": "https://api.sua-plataforma.com",
  "giovaniCodeReview.premiumToken": "TOKEN",
  "giovaniCodeReview.organizationId": "org-id",
  "giovaniCodeReview.workspaceId": "workspace-id"
}
```

---

## Arquitetura

```text
VS Code Extension
        ↓
PremiumReviewSyncService
        ↓
RemoteReviewDatabaseClient
        ↓
Premium API
        ↓
Remote Database
```

---

## Contratos implementados

- `PremiumPlan`
- `PremiumFeatureFlags`
- `PremiumPlanProvider`
- `RemoteReviewDatabaseClient`
- `PremiumReviewSyncService`
- `VscodePremiumPlanProvider`
- `HttpRemoteReviewDatabaseClient`

---

## Roadmap Premium

### Implementado

- separação Community/Premium;
- feature flags premium;
- configuração por settings do VS Code;
- sincronização premium por contrato;
- cliente HTTP premium;
- proteção de token no dashboard;
- testes TDD da edição Premium.

### Próximos passos

- backend SaaS real;
- WebSocket realtime;
- autenticação por organização;
- billing;
- painel administrativo;
- analytics avançado.
