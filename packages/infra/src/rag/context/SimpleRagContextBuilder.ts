import { RagChunkDTO, RagContextBuilderPort } from '@code-review/core';

export class SimpleRagContextBuilder implements RagContextBuilderPort {
  constructor(private readonly chunks: RagChunkDTO[] = []) {}

  async buildContext(query: string): Promise<RagChunkDTO[]> {
    const normalized = query.toLowerCase();
    return this.chunks
      .filter(chunk => chunk.content.toLowerCase().includes(normalized))
      .slice(0, 5);
  }
}
