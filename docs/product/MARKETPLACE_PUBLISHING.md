# Marketplace Publishing

## Produto

**Git Code Review** — code review governance workspace for reviewers inside VS Code.

## Pacote

```text
git-code-review-2.3.1.vsix
```

## Antes de publicar

Execute:

```bash
npm run product:release
```

Esse gate valida typecheck, testes de produção, build, empacotamento VSIX, conteúdo do VSIX, readiness de produto e auditoria crítica.

## Publicação

A publicação no Marketplace deve ser feita apenas pelo dono do publisher configurado no `package.json`.

Com o token configurado no ambiente:

```bash
cd apps/vscode
vsce publish --packagePath git-code-review-2.3.1.vsix
```

Alternativa: upload manual do `.vsix` no painel do publisher.

## Checklist final

| Item | Status esperado |
|---|---|
| Nome | Git Code Review |
| Público-alvo | Code reviewers |
| Versão | 2.3.1 |
| Display name sem Beta | OK |
| README de marketplace | OK |
| Ícone | OK |
| Screenshots | OK |
| VSIX validado | OK |
| Vulnerabilidade crítica | Nenhuma |
| Base branch auto-detect | OK |
| Fallback sem branch base | OK |
