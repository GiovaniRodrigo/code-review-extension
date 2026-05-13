import {
  AIAnalysisRequestDTO,
  AIAnalysisResponseDTO
} from '../../dto/ai/AIAnalysisDTO';
import { AIAnalysisService } from '../../services/ai/AIAnalysisService';

export class AnalyzeCodeWithAIUseCase {
  constructor(private readonly analysisService: AIAnalysisService) {}

  execute(input: AIAnalysisRequestDTO): Promise<AIAnalysisResponseDTO> {
    return this.analysisService.analyze(input);
  }
}
