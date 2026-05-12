# Integração com IA - Visão Geral

## 1. Objetivo
Definir como o sistema integra com IA via API externa, integrada à IDE ou localmente, de forma desacoplada e baseada em contratos.

## 2. Princípio Arquitetural
A extensão não depende de um provedor específico. Toda integração passa por uma interface comum.

```text
IDE Extension → AIService → AIProvider → (OpenAI / Ollama / etc)
```

## 3. Contrato Base
Todo provedor deve implementar `AIProvider`.
```ts
export interface AIProvider {
  id: string;
  name: string;
  type: 'api' | 'ide' | 'local';
  isAvailable(): Promise<boolean>;
  analyze(input: AIAnalysisInput): Promise<AIAnalysisResult>;
}
```
