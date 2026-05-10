# Ajustes de fluxo de revisão para versão mercado

## Objetivo

Corrigir pontos de uso real identificados no onboarding e no fluxo de avaliação.

## Alterações implementadas

### 1. Início da revisão por PR ou branch

Ao iniciar uma revisão, o usuário precisa selecionar explicitamente:

- modo Branch ou Pull Request;
- branch de origem;
- branch base/destino;
- identificador do PR, quando aplicável.

A sessão passa a ser criada com o contexto informado, e não apenas com uma ação genérica.

### 2. Esteira de avaliação por alterações/arquivos

A revisão passa a deixar claro que o princípio da avaliação é seguir a esteira:

```text
PR/Branch → diff contra base → arquivos alterados → comentários/findings → correção do dev → revalidação do reviewer
```

### 3. Desenvolvedor mostra sua correção

Cada finding agora apresenta uma área de correção do desenvolvedor com:

- commit ou branch da correção;
- descrição da correção;
- botão para mostrar a correção para revalidação;
- lista de tentativas já registradas.

Quando o dev registra a correção, o finding muda para `FIXED` e fica aguardando revalidação.

### 4. Findings e categorias menos engessados

As categorias usadas nos findings agora têm CRUD local:

- criar nova categoria;
- renomear categoria selecionada;
- remover categoria;
- usar categorias customizadas no select de validação.

### 5. Comentários técnicos explicados

Foi adicionada explicação visual separando:

- comentários técnicos: discussão pública e livre vinculada ao arquivo/linha;
- findings/validações: itens formais com severidade, responsável, correção e revalidação.

### 6. Tooltip de validar arquitetura

O tooltip do botão `Validar arquitetura` foi reposicionado para a esquerda, evitando ficar escondido fora da área visível.

### 7. Settings clicáveis

Os cards de integrações agora possuem ações:

- abrir `settings.json`;
- testar vínculo/sincronização.

### 8. Histórico como CRUD de título

A tela de histórico agora permite:

- selecionar uma sessão;
- salvar título customizado;
- excluir título customizado.

### 9. Responsável/desenvolvedor pela branch ou PR

Ao iniciar uma revisão, o responsável é inferido pela branch quando ela segue padrão como:

```text
feature/nome-dev/descricao
fix/nome-dev/descricao
hotfix/nome-dev/descricao
```

Em integrações reais com PR, o solicitante/autor do PR deve ser a fonte principal.
