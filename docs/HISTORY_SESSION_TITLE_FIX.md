# Correção: título e subtítulo da sessão no Histórico

## Problema

O menu **History** exibia os textos técnicos `history.title` e `history.subtitle` quando a chave de tradução não era resolvida corretamente.

Além disso, o título do histórico era gerenciado separadamente por um CRUD local, depois da sessão já criada, o que gerava inconsistência entre a sessão real e a visualização no histórico.

## Decisão

O título e o subtítulo passam a fazer parte da criação da sessão de review.

## Alterações aplicadas

- Adicionados os campos `title` e `subtitle` em `ReviewSession`.
- Adicionados `title` e `subtitle` no fluxo de `startReview`.
- Atualizado o modal de criação de sessão para solicitar:
  - título da sessão;
  - subtítulo da sessão.
- Atualizado o menu Histórico para exibir dados da própria sessão.
- Removida a dependência visual de `history.title` e `history.subtitle` no painel de sessões.
- Mantido fallback para sessões antigas sem título/subtítulo.
- Adicionado teste TDD garantindo persistência de título e subtítulo na criação da sessão.

## Validação

- `npm test`: 47/47 aprovados.
- `npm run compile`: concluído.
