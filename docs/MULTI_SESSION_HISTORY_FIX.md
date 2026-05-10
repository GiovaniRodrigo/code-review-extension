# Correção: múltiplas sessões no histórico

## Problema

Ao mudar de branch/PR e criar uma nova sessão, o histórico podia parecer conter apenas uma sessão ativa.

## Correção aplicada

- `startReview()` agora cria uma nova sessão sempre que o usuário inicia uma revisão.
- Sessões antigas da mesma branch/PR são preservadas como rodadas anteriores.
- Sessões de branches/PRs diferentes continuam isoladas.
- O painel força `postState()` após criar sessão para recarregar o histórico real do banco local.
- IDs de sessão agora incluem branch/PR + timestamp + sufixo aleatório para evitar sobrescrita.
- Repositórios ordenam sessões por atualização/criação mais recente.

## Regra de negócio

```txt
Trocar branch/PR -> muda sessão ativa conforme contexto.
Criar sessão -> adiciona nova sessão ao histórico, sem apagar anteriores.
Histórico -> mostra todas as sessões registradas.
```

## Exemplo

```txt
feature/login    -> Review Session A
feature/payment  -> Review Session B
feature/login    -> carrega Review Session A ou a rodada ativa mais recente dessa branch
```
