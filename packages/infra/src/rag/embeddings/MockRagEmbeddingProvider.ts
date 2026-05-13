import type { RagEmbeddingProviderPort } from '../../../../core/src/ports/rag/RagEmbeddingProviderPort';

export class MockRagEmbeddingProvider implements RagEmbeddingProviderPort {
  async generateEmbedding(text: string): Promise<number[]> {
    return Array.from(text.slice(0, 32)).map(char => char.charCodeAt(0) / 255);
  }
}
