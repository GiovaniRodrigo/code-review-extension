# Contratos e Dependências

## 1. Contratos Principais

### 1.1 IDE Adapter
Define como o core se comunica com a IDE.
```ts
export interface IDEAdapter {
  getCurrentWorkspace(): Promise<WorkspaceContext>;
  openDiff(filePath: string): Promise<void>;
  showNotification(message: string, type: NotificationType): Promise<void>;
}
```

### 1.2 AI Provider
Abstração para diferentes motores de IA.
```ts
export interface AIProvider {
  analyze(input: AIAnalysisInput): Promise<AIAnalysisResult>;
}
```

## 2. Gerenciamento de Dependências

### 2.1 Injeção de Dependência
Dependências são injetadas via construtor para facilitar testes e substituição.

### 2.2 Container de Composição
Ponto central onde as implementações concretas são ligadas aos contratos.
```ts
export function createContainer(adapter: IDEAdapter) {
  const git = new GitCliProvider();
  const ai = new AIProviderRegistry();
  return {
    startReview: new StartReviewUseCase(adapter, git),
  };
}
```
