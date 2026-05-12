# Human-in-the-Loop (HITL)

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