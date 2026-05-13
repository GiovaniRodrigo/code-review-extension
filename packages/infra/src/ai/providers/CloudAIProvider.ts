import type {
  AIAnalysisRequestDTO,
  AIAnalysisResponseDTO
} from '../../../../core/src/application/dto/ai/AIAnalysisDTO';
import type { AIProviderPort } from '../../../../core/src/ports/ai/AIProviderPort';

export class CloudAIProvider implements AIProviderPort {
  async analyzeCode(input: AIAnalysisRequestDTO): Promise<AIAnalysisResponseDTO> {
    return {
      findings: [
        {
          file: input.filePath,
          line: 1,
          severity: 'info',
          category: 'code_smell',
          message: 'Cloud provider scaffold is not configured.',
          confidence: 0.1
        }
      ]
    };
  }
}
