
import { PromptBuilder } from '../prompt/PromptBuilder';
import { ContextReducer } from '../context/ContextReducer';
import { AICommentParser } from '../parser/AICommentParser';
import { OllamaProvider } from '../providers/OllamaProvider';

export interface ReviewContext {
  fileName: string;
  code: string;
}

export class AIReviewOrchestrator {
  private readonly reducer = new ContextReducer();
  private readonly promptBuilder = new PromptBuilder();
  private readonly parser = new AICommentParser();
  private readonly provider = new OllamaProvider();

  async execute(context: ReviewContext) {
    const reduced = this.reducer.reduce(context.code);

    const prompt = this.promptBuilder.buildTechnicalReview({
      fileName: context.fileName,
      code: reduced
    });

    const response = await this.provider.generate(prompt);

    return this.parser.parse(response);
  }
}
