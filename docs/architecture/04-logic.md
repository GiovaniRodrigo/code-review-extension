# Lógica de Negócio e Fluxo

## 1. Casos de Uso (Use Cases)

Representam as ações do usuário no sistema. Exemplos:
- `StartReviewUseCase`: Inicializa sessão de revisão.
- `RunAIValidationUseCase`: Dispara análise de IA sobre o diff.

## 2. Fluxo de Execução

1. Usuário executa comando na IDE.
2. **IDE Adapter** captura e chama o **Use Case**.
3. **Use Case** consulta **Infrastructure** (Git/AI).
4. Resultados são salvos no **Domain**.
5. **Presentation** atualiza a UI com os novos dados.

## 3. Eventos de Domínio

O sistema utiliza eventos para desacoplar ações secundárias (ex: telemetria, logs):
- `SESSION_CREATED`
- `DIAGNOSTIC_APPROVED`
- `BRANCH_CHANGED`
