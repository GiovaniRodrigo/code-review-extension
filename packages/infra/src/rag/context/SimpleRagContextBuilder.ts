import type { RagChunkDTO } from '../../../../core/src/application/dto/rag/RagDTO';
import type { RagContextBuilderPort } from '../../../../core/src/ports/rag/RagContextBuilderPort';
import type { RagVectorStorePort } from '../../../../core/src/ports/rag/RagVectorStorePort';
import type { RagEmbeddingProviderPort } from '../../../../core/src/ports/rag/RagEmbeddingProviderPort';

export class SimpleRagContextBuilder implements RagContextBuilderPort {
  constructor(
    private readonly vectorStore: RagVectorStorePort,
    private readonly embeddingProvider: RagEmbeddingProviderPort,
    private readonly config: { maxChunks?: number } = {}
  ) {}

  async buildContext(query: string): Promise<RagChunkDTO[]> {
    const vector = await this.embeddingProvider.generateEmbedding(query);
    const limit = this.config.maxChunks ?? 5;
    return this.vectorStore.search(vector, limit);
  }
}
