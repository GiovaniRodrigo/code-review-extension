# Usage

Guia rapido para instalar, configurar e usar o MVP VS Code do AI Code Review.

## Requisitos

- Node.js instalado.
- VS Code instalado.
- Um workspace Git aberto no VS Code.
- Opcional: Ollama local rodando para usar provider `ollama`.
- Opcional: chave OpenAI para usar provider `openai`.

## Preparar o Projeto

```bash
npm install
npm test
```

## Gerar o Pacote VS Code

```bash
npm run package:vscode
```

O pacote sera gerado em:

```text
apps/vscode/vscode-code-review-2.0.0.vsix
```

## Instalar no VS Code

1. Abra o VS Code.
2. Abra a paleta de comandos.
3. Execute `Extensions: Install from VSIX...`.
4. Selecione `apps/vscode/vscode-code-review-2.0.0.vsix`.
5. Recarregue o VS Code se solicitado.

## Fluxo de Uso

1. Abra um projeto no VS Code.
2. Abra o arquivo que deseja revisar.
3. Execute o comando `Analyze Code with IA`.
4. Abra a view `AI Review > Findings`.
5. Revise os findings gerados.
6. Use `Approve` para aceitar um finding.
7. Use `Reject` para rejeitar um finding.
8. Findings aprovados aparecem como diagnostics inline no editor.
9. Se um finding aprovado tiver `suggestedFix`, use `Apply Fix`.
10. Confirme o preview exibido pelo VS Code antes de aplicar a alteracao.

Para limpar a sessao atual, execute:

```text
Clear Current Review Session
```

## Inteligencia e Contexto (Fase 3)

A extensao utiliza tecnicas avancadas para melhorar a precisao e visibilidade:

- **Heatmap de Riscos**: O sistema analisa o historico de reviews e destaca arquivos com maior acumulado de problemas (calculado pelo `HeatmapService`).
- **Context Engine**: Seus feedbacks (aprovar/rejeitar) sao usados como contexto para as proximas analises da IA. Se voce rejeitar um tipo de finding, a IA aprendera a nao reporta-lo novamente.

## Enterprise e Ecossistema (Fase 4)

### Resiliencia com Fallback
Voce pode configurar um provedor secundario para fallback automatico. Se o provedor Cloud (ex: OpenAI) falhar ou estiver offline, a extensao tentara usar o provedor Local (ex: Ollama).

### Publicacao em Pull Requests
Findings aprovados podem ser publicados diretamente como comentarios em PRs do GitHub utilizando o `PublishPRReviewUseCase`. (Disponivel via comandos da API ou integracao customizada).

### Auditoria
Todas as acoes criticas sao registradas pelo `AuditLogService` para conformidade e rastreabilidade organizacional.

## Providers de IA

### Mock

Provider padrao para validar o fluxo sem depender de servicos externos.

```json
{
  "codeReview.provider": "mock"
}
```

### Ollama

Use quando quiser revisar com IA local.

```json
{
  "codeReview.provider": "ollama",
  "codeReview.ollama.baseUrl": "http://localhost:11434",
  "codeReview.ollama.model": "llama3"
}
```

### OpenAI

1. Execute o comando `Set OpenAI API Key`.
2. Informe a chave no prompt seguro do VS Code.
3. Configure o provider:

```json
{
  "codeReview.provider": "openai",
  "codeReview.openai.model": "gpt-4o-mini"
}
```

A chave e armazenada no `SecretStorage` do VS Code, nao nas settings do workspace.

## Persistencia

As sessoes de review sao persistidas no storage global da extensao e restauradas pela branch atual. Ao trocar de branch, rode uma nova analise ou reabra a view para carregar a sessao correspondente.

## Estados Esperados

- `loading`: analise em andamento.
- `ready`: findings carregados.
- `empty`: nenhuma sessao ou nenhum finding.
- `error`: erro de provider, arquivo vazio, arquivo ausente ou resposta invalida.

## Troubleshooting

- Se aparecer erro de arquivo ausente, abra um arquivo antes de executar a analise.
- Se aparecer erro de arquivo vazio, salve ou selecione um arquivo com conteudo.
- Se Ollama falhar, confirme se o servidor esta em `http://localhost:11434` e se o modelo esta instalado.
- Se OpenAI falhar, execute `Set OpenAI API Key` novamente e confirme o modelo configurado.
- Se a extensao parecer presa em uma sessao antiga, execute `Clear Current Review Session`.
