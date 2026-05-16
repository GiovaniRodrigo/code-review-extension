import { Finding } from '@code-review/domain';
import { RagVectorStorePort } from '../../../ports/rag/RagVectorStorePort';
import { RagEmbeddingProviderPort } from '../../../ports/rag/RagEmbeddingProviderPort';

export class ReinforcementService {
  constructor(
    private readonly vectorStore: RagVectorStorePort,
    private readonly embeddingProvider: RagEmbeddingProviderPort
  ) {}

  async learnFromFinding(finding: Finding): Promise<void> {
    const isNegative = finding.status === 'rejected';
    const tag = isNegative ? '[NEGATIVE_EXAMPLE]' : '[POSITIVE_EXAMPLE]';
    
    // We index the finding message and file context to help AI avoid/repeat similar patterns
    const content = `${tag} ${finding.message}\nFile: ${finding.file}\nLine: ${finding.line}`;
    const vector = await this.embeddingProvider.generateEmbedding(content);

    await this.vectorStore.add({
      id: `reinforcement-${finding.id}`,
      content,
      source: 'reinforcement-learning',
      metadata: {
        type: isNegative ? 'false-positive' : 'valid-finding',
        originalFindingId: finding.id,
        severity: finding.severity
      }
    }, vector);

    console.log(`[REINFORCEMENT] Learned from ${finding.status} finding: ${finding.id}`);
  }

  async getReinforcementContext(query: string): Promise<string> {
    const vector = await this.embeddingProvider.generateEmbedding(query);
    const examples = await this.vectorStore.search(vector, 3); // Top 3 relevant examples

    if (examples.length === 0) return '';

    let context = '\n### Human-in-the-Loop Feedback (Learning from past interactions):\n';
    examples.forEach(ex => {
        context += `- ${ex.content}\n`;
    });

    return context;
  }
}
