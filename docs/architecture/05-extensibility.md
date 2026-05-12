# Estratégia de Extensibilidade

## 1. Suporte Multi-IDE
Cada IDE implementa apenas seu `IDEAdapter`. O núcleo permanece idêntico.

## 2. Adicionando Novos Componentes

### 2.1 Novo Provider de IA
1. Implementar `AIProvider`.
2. Registrar no `AIProviderRegistry`.

### 2.2 Nova IDE
1. Criar novo app em `apps/`.
2. Implementar `IDEAdapter`.
3. Reaproveitar pacotes do `packages/`.

## 3. Manutenção e Evolução
- **Feature Modules**: Cada funcionalidade deve ser isolada (`features/diagnostics`, `features/sessions`).
- **Não alterar o core**: Adicione novos contratos ou use cases em vez de modificar os existentes já validados.
