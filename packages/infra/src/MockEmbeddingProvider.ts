import { RagEmbeddingProviderPort, RagVectorStorePort, RagChunkDTO } from '@code-review/core';

export class MockEmbeddingProvider implements RagEmbeddingProviderPort {
  async generateEmbedding(text: string): Promise<number[]> {
    // Return a dummy vector based on text length
    return Array.from({ length: 1536 }, (_, i) => text.length + i);
  }
}

export class MockVectorStore implements RagVectorStorePort {
  private store = new Map<string, { chunk: RagChunkDTO, vector: number[] }>();

  async add(chunk: RagChunkDTO, vector: number[]): Promise<void> {
    this.store.set(chunk.id, { chunk, vector });
  }

  async search(vector: number[], limit: number, query?: string): Promise<RagChunkDTO[]> {
    // Return everything (very mocky)
    return [...this.store.values()]
      .slice(0, limit)
      .map(item => item.chunk);
  }

  async deleteBySource(source: string): Promise<void> {
    for (const [id, item] of this.store.entries()) {
      if (item.chunk.source === source) {
        this.store.delete(id);
      }
    }
  }

  async clear(): Promise<void> {
    this.store.clear();
  }
}
