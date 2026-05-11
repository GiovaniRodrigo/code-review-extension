# Correção — Lifecycle, Console e Fidelidade Community/Premium

## Objetivo

Corrigir problemas observados no console do VS Code e na experiência visual do dashboard, principalmente:

- excesso de listeners;
- risco de Extension Host não responsivo;
- atualizações repetidas de estado;
- decorations sem descarte controlado;
- ausência de comunicação clara entre Community e Premium.

## Correções aplicadas

### Lifecycle do Webview

- O painel central agora controla os disposables do webview.
- `onDidReceiveMessage` é descartado quando o painel fecha.
- timers de `postState` são limpos no dispose.
- documentos virtuais de diff são limpos no dispose.
- decorations de comentário são reutilizadas e descartadas corretamente.

### Redução de listeners e polling

- O watcher de Git agora evita execuções concorrentes.
- O polling padrão subiu de 2s para 8s.
- Mudanças acumuladas são processadas com pequeno debounce.

### Atualização de estado mais segura

- `postState` agora possui proteção contra execução simultânea.
- Atualizações disparadas por mudança de branch/PR são agendadas com debounce.

### CSP do Webview

- `font-src` agora permite `data:` para evitar bloqueio de fontes empacotadas pelo build quando necessário.

### Fidelidade visual Community/Premium

Criado o componente:

```text
EditionStatus
```

Ele aparece em:

- sidebar esquerda;
- dashboard principal;
- painel direito.

A UI agora comunica:

- edição ativa;
- status de IA;
- status de sincronização;
- privacidade/local-first;
- recursos Premium liberados ou bloqueados.

## Testes

Adicionados testes de regressão para:

- apresentação consciente de edição;
- lifecycle do webview;
- proteção contra polling agressivo.
