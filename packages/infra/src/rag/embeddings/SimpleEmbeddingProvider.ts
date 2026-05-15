import type { RagEmbeddingProviderPort } from '../../../../core/src/ports/rag/RagEmbeddingProviderPort';

export class SimpleEmbeddingProvider implements RagEmbeddingProviderPort {
  async generateEmbedding(text: string): Promise<number[]> {
    // Return a dummy vector based on text length for now (stabilization phase)
    return Array(1536).fill(text.length / 1000);
  }
}
