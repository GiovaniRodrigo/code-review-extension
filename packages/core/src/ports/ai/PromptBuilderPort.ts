import { AIAnalysisRequestDTO } from '../../application/dto/ai/AIAnalysisDTO';

export interface PromptBuilderPort {
  buildAnalysisPrompt(input: AIAnalysisRequestDTO): string;
}
