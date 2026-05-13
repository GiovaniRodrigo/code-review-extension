# Human-in-the-Loop (HITL)

## MVP VS Code

O MVP atual entrega um fluxo local de code review assistido por IA para VS Code:

- analise do arquivo ativo;
- findings estruturados com severidade e confidence score;
- sidebar com aprovacao/rejeicao Human-in-the-Loop;
- diagnosticos inline apenas apos aprovacao humana;
- persistencia local das sessoes por branch;
- provider mock para uso imediato;
- provider local Ollama configuravel.
- provider OpenAI configuravel.

### Como usar

1. Execute `npm install`.
2. Execute `npm test`.
3. Gere o pacote com `npm run package:vscode`.
4. Instale `apps/vscode/vscode-code-review-2.0.0.vsix` no VS Code.
5. Abra um projeto no VS Code.
6. Execute o comando `Analyze Code with IA`.
7. Revise os findings na view `AI Review > Findings`.
8. Aprove ou rejeite cada finding.
9. Findings aprovados aparecem como diagnosticos inline no editor.

Para limpar a sessao atual, execute o comando `Clear Current Review Session`.

### Configuracao

Por padrao, a extensao usa o provider `mock`.

Para usar Ollama local:

```json
{
  "codeReview.provider": "ollama",
  "codeReview.ollama.baseUrl": "http://localhost:11434",
  "codeReview.ollama.model": "llama3"
}
```

Para usar OpenAI:

1. Execute o comando `Set OpenAI API Key`.
2. Salve a chave no prompt seguro do VS Code.
3. Configure o provider:

```json
{
  "codeReview.provider": "openai",
  "codeReview.openai.model": "gpt-4o-mini"
}
```

As sessoes sao persistidas no storage global da extensao e restauradas pela branch atual quando a view e aberta.

## Visão Geral

O sistema de validação por Inteligência Artificial deve obrigatoriamente operar utilizando o modelo Human-in-the-Loop (HITL).

Nesse modelo, a IA atua como assistente técnico de revisão, enquanto a decisão final permanece sob responsabilidade humana.

A IA nunca deve alterar código automaticamente sem aprovação explícita do usuário.

---

# Objetivos do HITL

O HITL tem como finalidade:

- Evitar falsos positivos
- Evitar alterações incorretas
- Garantir controle humano
- Melhorar confiabilidade das análises
- Permitir aprendizado contínuo
- Possibilitar revisão contextual
- Permitir feedback para melhoria da IA

---

# Papel da IA

A IA deve:

- Analisar código
- Detectar problemas
- Gerar diagnósticos
- Sugerir melhorias
- Explicar riscos
- Gerar comentários técnicos
- Propor correções
- Priorizar problemas

A IA não possui autoridade final sobre o código.

---

# Papel Humano

O usuário/revisor deve:

- Aprovar sugestões
- Rejeitar sugestões
- Editar comentários
- Solicitar nova análise
- Reclassificar severidade
- Confirmar correções
- Validar contexto funcional
- Encerrar revisão

---

# Fluxo HITL

```text
IA executa análise
        ↓
Diagnósticos são gerados
        ↓
Sistema apresenta sugestões
        ↓
Usuário avalia resultados
        ↓
Usuário aprova/rejeita
        ↓
Sistema registra feedback
        ↓
Sessão é atualizada
