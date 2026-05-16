import type {
  AIAnalysisRequestDTO,
  AIAnalysisResponseDTO
} from '../../../../core/src/application/dto/ai/AIAnalysisDTO';
import type { AIProviderPort, HealthStatusDTO } from '../../../../core/src/ports/ai/AIProviderPort';

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
}
