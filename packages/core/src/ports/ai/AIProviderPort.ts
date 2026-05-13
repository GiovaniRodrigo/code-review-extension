import {
  AIAnalysisRequestDTO,
  AIAnalysisResponseDTO
} from '../../application/dto/ai/AIAnalysisDTO';

export interface AIProviderPort {
  analyzeCode(input: AIAnalysisRequestDTO): Promise<AIAnalysisResponseDTO>;
}
