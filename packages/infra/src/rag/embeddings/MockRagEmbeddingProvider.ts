import { RagEmbeddingProviderPort } from '@code-review/core';

export class MockRagEmbeddingProvider implements RagEmbeddingProviderPort {
  async generateEmbedding(text: string): Promise<number[]> {
    return Array.from(text.slice(0, 32)).map(char => char.charCodeAt(0) / 255);
  }
}
