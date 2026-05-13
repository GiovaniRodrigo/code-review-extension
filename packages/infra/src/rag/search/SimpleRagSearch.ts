import type { RagChunkDTO } from '../../../../core/src/application/dto/rag/RagDTO';

export class SimpleRagSearch {
  search(chunks: RagChunkDTO[], query: string, limit = 5): RagChunkDTO[] {
    const normalized = query.toLowerCase();
    return chunks
      .filter(chunk => chunk.content.toLowerCase().includes(normalized))
      .slice(0, limit);
  }
}
