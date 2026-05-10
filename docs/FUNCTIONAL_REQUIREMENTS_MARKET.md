# Requisitos Funcionais — Versão Mercado

## RF01 — Gestão de Revisões

- Criar sessão de revisão por branch, PR, commit ou workspace.
- Listar revisões abertas, concluídas, reprovadas e arquivadas.
- Abrir revisão existente sem perder histórico.
- Finalizar revisão como aprovada, aprovada com ressalvas, ajustes solicitados ou reprovada.

## RF02 — Navegação de Código

- Exibir arquivos alterados.
- Navegar por commits.
- Abrir arquivo no VS Code.
- Registrar alvo de navegação no histórico da sessão.

## RF03 — Comentários de Review

- Criar comentários vinculados a arquivo, linha, commit e sessão.
- Editar comentários preservando histórico.
- Classificar por severidade e categoria.
- Permitir threads, respostas, menções e resolução.

## RF04 — Validações e Diagnósticos

- Registrar findings com severidade, status, categoria e origem.
- Detectar violações SOLID, DDD e Clean Architecture.
- Registrar tentativas de correção.
- Revalidar findings preservando trilha de auditoria.

## RF05 — Colaboração

- Registrar mensagens de colaboração.
- Permitir aprovações parciais.
- Bloquear merge quando existirem findings críticos ou altos pendentes.
- Emitir notificações locais para menções e mudanças relevantes.

## RF06 — Score e Métricas

- Calcular score de qualidade.
- Medir recorrência de problemas.
- Medir tempo de correção.
- Apresentar indicadores no dashboard.

## RF07 — Auditoria e Persistência

- Persistir sessões localmente.
- Exportar logs de auditoria.
- Exportar banco local.
- Criar backup.
- Sincronizar repositório remoto quando configurado.

## RF08 — Onboarding e UX

- Mostrar onboarding para novos usuários.
- Destacar botões, menus e áreas importantes.
- Explicar fluxo passo a passo.
- Permitir retorno ao tutorial.

## RF09 — Marketplace

- Gerar `.vsix`.
- Ter README, CHANGELOG, LICENSE, ícone, atalhos e comandos documentados.
- Ser compatível com Linux, Windows e macOS.
- Funcionar sem tela vazia, erro silencioso ou build quebrado.
