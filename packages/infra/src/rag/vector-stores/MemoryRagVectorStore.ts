import { RagChunkDTO, RagVectorStorePort } from '@code-review/core';

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
