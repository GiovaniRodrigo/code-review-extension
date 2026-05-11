import { AIModelInfo, AIProvider, ReviewContext, SuggestedReviewComment } from '../../contracts';

export class PremiumAIProvider implements AIProvider {
  readonly id = 'premium.cloud-ai';
  readonly label = 'IA Premium Integrada';

  async getModelInfo(): Promise<AIModelInfo> {
    return { provider: 'premium-cloud', model: 'graph-context-review', local: false };
  }

  async generateReviewComments(context: ReviewContext): Promise<SuggestedReviewComment[]> {
    return context.changedFiles.slice(0, 5).map((file, index) => ({
      id: `premium-ai-comment-${index + 1}`,
      body: 'Sugestão Premium IA: revisar impacto arquitetural com Graph + Analyzer antes da finalização da sessão.',
      file,
      line: 1,
      severity: 'MEDIUM',
      source: 'ai',
      rationale: 'A Premium Edition combina IA integrada, Graph remoto e histórico organizacional para reduzir contexto enviado ao LLM.',
      requiresHumanApproval: true
    }));
  }

  async summarizeReview(context: ReviewContext): Promise<string> {
    return `Resumo premium: análise com contexto de Graph para ${context.changedFiles.length} arquivo(s).`;
  }
}
