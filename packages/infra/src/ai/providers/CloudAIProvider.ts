import type {
  AIAnalysisRequestDTO,
  AIAnalysisResponseDTO,
  AIChatRequestDTO,
  AIChatResponseDTO
} from '@code-review/core';
import type { AIProviderPort, HealthStatusDTO } from '@code-review/core';

export class CloudAIProvider implements AIProviderPort {
  async checkHealth(): Promise<HealthStatusDTO> {
    return { status: 'unavailable', message: 'Cloud provider not configured' };
  }

  async analyzeCode(input: AIAnalysisRequestDTO): Promise<AIAnalysisResponseDTO> {
    return {
      findings: [
        {
          file: input.filePath,
          line: 1,
          severity: 'info',
          category: 'code_smell',
          message: 'Cloud provider scaffold is not configured.',
          confidenceScore: 0.1
        }
      ],
      confidenceScore: 0.1
    };
  }

  async chat(input: AIChatRequestDTO): Promise<AIChatResponseDTO> {
    return {
      answer: "Cloud AI provider is not fully implemented."
    };
  }
}
