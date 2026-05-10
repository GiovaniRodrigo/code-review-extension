# Refatoração finalizada em `src`

## Objetivo

Reduzir o acoplamento do backend da extensão, mantendo a separação iniciada no último commit entre domínio, aplicação, infraestrutura e apresentação.

## Alterações realizadas

- Criação de contratos de caso de uso em `src/application/useCases.ts`.
- Remoção dos principais `any` da fachada `ReviewSessionService`.
- Tipagem explícita dos comandos de ciclo de vida, comentários, findings, colaboração, persistência e dashboard.
- `ReviewPanel` e `ReviewSidebarProvider` passaram a depender de `ReviewSessionUseCases`, não mais da classe concreta `ReviewSessionService`.
- Criação de `src/infrastructure/vscodeCompositionRoot.ts` para centralizar a montagem de dependências do VS Code.
- `extension.ts` deixou de instanciar repositório, Git service, provider de arquivos e auditoria diretamente.
- `runArchitectureValidation` agora retorna `session`, `findings` e `findingsCount`, evitando acoplamento da apresentação à estrutura interna da resposta.
- Adicionados type guards no domínio para status/severidade, removendo validações duplicadas fora da camada de domínio.
- Mantida compatibilidade com testes existentes por meio do alias `updateMergeDecision`.

## Validação

Comandos executados com sucesso:

```bash
npm run build:extension
npm test
npm run compile
```

Resultado dos testes:

```txt
32 testes executados
32 testes aprovados
0 falhas
```

## Observação

O projeto ainda possui o arquivo legado `src/domain/reviewSession.ts` como barrel de compatibilidade. Ele foi mantido para não quebrar testes e imports existentes, mas a evolução recomendada é migrar gradualmente imports para os arquivos de domínio específicos (`ReviewSession.ts`, `ReviewComment.ts`, `ValidationFinding.ts`, etc.).
