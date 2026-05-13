import { RagChunkDTO } from '@code-review/core';

export class SimpleRagSearch {
  search(chunks: RagChunkDTO[], query: string, limit = 5): RagChunkDTO[] {
    const normalized = query.toLowerCase();
    return chunks
      .filter(chunk => chunk.content.toLowerCase().includes(normalized))
      .slice(0, limit);
  }
}
