# Feedback de Usuário

O sistema deve fornecer feedback completo para todas as operações relevantes da extensão.

## Estados obrigatórios

Toda ação disparada pela interface deve possuir pelo menos um destes estados:

- carregando;
- sucesso;
- erro;
- alerta;
- vazio;
- progresso.

## Regras oficiais

- Nenhuma operação assíncrona pode deixar a interface parada sem retorno visual.
- Operações longas devem enviar `operationStarted` antes do processamento.
- Operações concluídas devem enviar `operationCompleted`.
- Falhas devem enviar `operationFailed` com mensagem compreensível.
- Feedback crítico usa `role="alert"`.
- Feedback informativo usa `role="status"` e `aria-live="polite"`.
- Estados de carregamento usam `aria-busy="true"`.

## Fluxos cobertos

- criação de sessão;
- abertura de sessão;
- atualização de status;
- comentários;
- validações;
- diff;
- arquivos;
- testes;
- exportação;
- backup;
- sincronização remota premium;
- onboarding.

## Implementação

A interface usa o componente `UserFeedback` para feedback global e `InlineFeedback` para feedback contextual.

O backend da extensão envia eventos padronizados para a webview:

```text
operationStarted
operationCompleted
operationFailed
```
