import { AIAnalysisInput, AIAnalysisResult, AIProvider } from './interfaces';

export class FallbackAIProvider implements AIProvider {
  constructor(
    private primary: AIProvider,
    private secondary: AIProvider,
    private onFallback?: (error: Error) => void
  ) {}

  async analyzeCode(input: AIAnalysisInput): Promise<AIAnalysisResult> {
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
}
