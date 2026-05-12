# Conformidade e Qualidade

## 1. Regras Proibidas
- NÃO chamar API da IDE fora do Adapter.
- NÃO chamar IA diretamente da UI.
- NÃO aplicar correções de código sem aprovação humana (HITL).
- NÃO misturar lógica de negócio com Webviews.

## 2. Testabilidade
Toda regra deve ser testável sem abrir a IDE.
- Testes unitários para Use Cases.
- Mocks para contratos de Infrastructure e IDE.

## 3. Critérios de Aceite
- Core independente de IDE.
- IA desacoplada via Strategy.
- HITL (Human-in-the-Loop) obrigatório em todas as sugestões.
- Storage e Git abstraídos por contratos.
