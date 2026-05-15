import type { RagChunkDTO } from '../../../../core/src/application/dto/rag/RagDTO';
import type { RagVectorStorePort } from '../../../../core/src/ports/rag/RagVectorStorePort';

export class MemoryRagVectorStore implements RagVectorStorePort {
  private readonly items: { chunk: RagChunkDTO, vector: number[] }[] = [];

  async add(chunk: RagChunkDTO, vector: number[]): Promise<void> {
    this.items.push({ chunk, vector });
  }

  async search(_vector: number[], limit: number): Promise<RagChunkDTO[]> {
    // Simplified: return top items. In Phase 6 we can add cosine similarity.
    return this.items.map(i => i.chunk).slice(0, limit);
  }

  async clear(): Promise<void> {
    this.items.length = 0;
  }
}
