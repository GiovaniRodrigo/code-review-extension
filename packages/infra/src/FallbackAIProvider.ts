import { 
  AIAnalysisRequestDTO, 
  AIAnalysisResponseDTO, 
  AIProviderPort, 
  HealthStatusDTO,
  AIChatRequestDTO,
  AIChatResponseDTO
} from '@code-review/core';

export class FallbackAIProvider implements AIProviderPort {
  constructor(
    private primary: AIProviderPort,
    private secondary: AIProviderPort,
    private onFallback?: (error: Error) => void
  ) {}

  async checkHealth(): Promise<HealthStatusDTO> {
    const primaryHealth = await this.primary.checkHealth();
    if (primaryHealth.status === 'available') {
        return primaryHealth;
    }
    return this.secondary.checkHealth();
  }

  async analyzeCode(input: AIAnalysisRequestDTO): Promise<AIAnalysisResponseDTO> {
    try {
      return await this.primary.analyzeCode(input);
    } catch (error: any) {
      if (this.onFallback) {
        this.onFallback(error);
      }
      console.warn(`Primary AI provider failed, falling back: ${error.message}`);
      return await this.secondary.analyzeCode(input);
    }
  }

  async chat(input: AIChatRequestDTO): Promise<AIChatResponseDTO> {
    try {
      return await this.primary.chat(input);
    } catch (error: any) {
      if (this.onFallback) {
        this.onFallback(error);
      }
      console.warn(`Primary AI provider failed for chat, falling back: ${error.message}`);
      return await this.secondary.chat(input);
    }
  }
}
