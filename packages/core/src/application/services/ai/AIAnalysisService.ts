import { AIProviderPort } from '../../../ports/ai/AIProviderPort';
import {
  AIAnalysisRequestDTO,
  AIAnalysisResponseDTO
} from '../../dto/ai/AIAnalysisDTO';

export class AIAnalysisService {
  constructor(private readonly aiProvider: AIProviderPort) {}

  analyze(input: AIAnalysisRequestDTO): Promise<AIAnalysisResponseDTO> {
    return this.aiProvider.analyzeCode({
      ...input,
      mode: input.mode ?? 'fast'
    });
  }
}
