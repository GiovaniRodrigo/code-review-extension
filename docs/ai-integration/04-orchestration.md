# Orquestração e Configuração

> Para regras completas de execução da IA, modos `fast`, `standard`, `deep`, `audit`, contratos JSON, contexto mínimo, RAG, AST, quality gate e fallback, consulte [06-execution-guidelines.md](./06-execution-guidelines.md).

## 1. Seleção de Provider
O `AIProviderRegistry` gerencia os provedores disponíveis. O usuário seleciona o ativo via configurações.

## 2. Serviço de IA (AIService)
Ponto central que valida a disponibilidade do provedor selecionado e encaminha a análise.

## 3. Exemplo de Configuração
```json
{
  "ai": {
    "defaultProvider": "local-ai-provider",
    "providers": {
      "local": { "enabled": true, "baseUrl": "http://localhost:11434" }
    }
  }
}
```
