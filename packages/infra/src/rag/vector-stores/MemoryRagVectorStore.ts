import type { RagChunkDTO } from '../../../../core/src/application/dto/rag/RagDTO';
import type { RagVectorStorePort } from '../../../../core/src/ports/rag/RagVectorStorePort';

export class MemoryRagVectorStore implements RagVectorStorePort {
  private readonly chunks: RagChunkDTO[] = [];

  async add(chunk: RagChunkDTO): Promise<void> {
    this.chunks.push(chunk);
  }

  async search(_vector: number[], limit: number): Promise<RagChunkDTO[]> {
    return this.chunks.slice(0, limit);
  }

  async clear(): Promise<void> {
    this.chunks.length = 0;
  }
}
