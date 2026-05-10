# Tela Tratada de Comparação

## Objetivo

Os botões de comparação do Git Review devem mostrar as diferenças diretamente na interface central da extensão, sem depender apenas da abertura do diff bruto do VS Code.

## Comportamento implementado

- Botão **Comparar em tela** abre a comparação tratada no painel central.
- Botão **Base x Atual** mantém a visão lado a lado tradicional.
- Botão **Abrir diff no VS Code** continua disponível como ação secundária.
- A tela tratada mostra:
  - arquivo selecionado;
  - quantidade de adições;
  - quantidade de remoções;
  - quantidade de blocos/hunks;
  - linhas adicionadas, removidas e de contexto;
  - estado de carregamento;
  - estado vazio;
  - estado de erro tratado.

## Regra de UX

A comparação principal deve ser compreensível para usuário final. O diff bruto é mantido apenas como alternativa técnica.

## Critério de aceite

- Ao clicar em **Comparar em tela**, o usuário visualiza as diferenças dentro da extensão.
- A tela não fica vazia durante carregamento ou erro.
- As linhas adicionadas e removidas são separadas visualmente.
- O clique em linha adicionada permite selecionar a linha para comentário inline.
