import { AIModelInfo, AIProvider, ReviewContext, SuggestedReviewComment } from '../../contracts';

/**
 * Community placeholder for user-owned local/VS Code AI providers.
 *
 * This adapter intentionally does not fabricate review comments. It only reports
 * that no concrete local AI provider is configured yet. Real integrations such
 * as Ollama, LM Studio, Continue or Copilot must implement AIProvider and be
 * selected by configuration before suggestions are shown in the UI.
 */
export class LocalDeterministicAIProvider implements AIProvider {
  readonly id = 'community.local-ai-unconfigured';
  readonly label = 'IA local não configurada';

  async getModelInfo(): Promise<AIModelInfo> {
    return { provider: 'local', model: 'not-configured', local: true };
  }

  async generateReviewComments(_context: ReviewContext): Promise<SuggestedReviewComment[]> {
    return [];
  }

  async summarizeReview(_context: ReviewContext): Promise<string> {
    return 'IA local não configurada. Configure um provider real para gerar resumo de review.';
  }
}
