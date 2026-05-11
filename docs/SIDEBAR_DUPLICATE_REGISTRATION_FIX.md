# Correção — Registro duplicado da sidebar

## Problema

A ativação da extensão podia falhar com a mensagem:

```text
View provider for 'giovaniCodeReview.sidebar' already registered.
Cannot register multiple views with same id `giovaniCodeReview.sidebar`
```

## Causa

O VS Code não permite registrar mais de um `WebviewViewProvider` para o mesmo id de view dentro do mesmo Extension Host.

Mesmo com apenas um comando ativo no manifesto, cenários de reload/hot reload/ativação dupla podem tentar registrar novamente a view `giovaniCodeReview.sidebar`.

## Correção aplicada

Foi criada uma proteção de registro único:

```text
src/infrastructure/vscode/safeWebviewRegistration.ts
```

A ativação agora usa:

```text
registerWebviewViewProviderOnce(...)
```

em vez de chamar diretamente:

```text
vscode.window.registerWebviewViewProvider(...)
```

## Resultado

- A extensão mantém apenas um provider para `giovaniCodeReview.sidebar`.
- Ativações duplicadas não derrubam a extensão.
- O erro de múltiplas views registradas é tratado com segurança.

## Validação

- `npm test`: 59/59 aprovados.
- `npm run compile`: concluído.
