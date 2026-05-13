import type { AIAnalysisRequestDTO } from '../../../../core/src/application/dto/ai/AIAnalysisDTO';
import type { PromptBuilderPort } from '../../../../core/src/ports/ai/PromptBuilderPort';

export class FastAnalysisPromptBuilder implements PromptBuilderPort {
  buildAnalysisPrompt(input: AIAnalysisRequestDTO): string {
    return [
      'Analyze the provided code and return only valid JSON.',
      'Do not explain reasoning.',
      `File: ${input.filePath}`,
      input.context ? `Context: ${input.context}` : '',
      input.code
    ].filter(Boolean).join('\n\n');
  }
}
