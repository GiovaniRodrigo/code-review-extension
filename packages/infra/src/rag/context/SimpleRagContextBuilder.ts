import type { RagChunkDTO } from '../../../../core/src/application/dto/rag/RagDTO';
import type { RagContextBuilderPort } from '../../../../core/src/ports/rag/RagContextBuilderPort';

export class SimpleRagContextBuilder implements RagContextBuilderPort {
  constructor(private readonly chunks: RagChunkDTO[] = []) {}

  async buildContext(query: string): Promise<RagChunkDTO[]> {
    const normalized = query.toLowerCase();
    return this.chunks
      .filter(chunk => chunk.content.toLowerCase().includes(normalized))
      .slice(0, 5);
  }
}
