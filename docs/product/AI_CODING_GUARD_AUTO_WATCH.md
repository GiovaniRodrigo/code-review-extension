# AI Coding Guard Auto Watch

## Versão

5.1.1

## Objetivo

O AI Coding Guard Auto Watch monitora documentos alterados no VS Code e valida código possivelmente gerado por LLM assim que ele aparece no workspace.

## Comportamento

- Escaneia alterações em documentos abertos.
- Escaneia arquivos salvos.
- Atualiza o status bar com `AI Guard: Clean`, `Warn` ou `Blocked`.
- Mostra notificação quando encontra não conformidades.
- Registra findings locais com origem `auto-watch`.
- Abre o módulo AI Coding Guard para revisão humana.

## Limitação

A extensão não controla diretamente prompts de permissão de outras extensões/agentes. O Auto Watch atua assim que o conteúdo aparece em um editor/documento do VS Code.

## Regras iniciais

- Segredos hardcoded: Critical.
- SQL interpolado/raw: High.
- `eval`/`new Function`: High.
- Violação de camada domínio/infra: High.
- Regra de negócio em controller: Medium.
- Código produtivo sem teste associado: Low.
