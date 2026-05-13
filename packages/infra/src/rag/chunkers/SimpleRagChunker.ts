import type { RagChunkDTO } from '../../../../core/src/application/dto/rag/RagDTO';
import type { RagChunkerPort } from '../../../../core/src/ports/rag/RagChunkerPort';

export class SimpleRagChunker implements RagChunkerPort {
  async chunk(content: string, source: string): Promise<RagChunkDTO[]> {
    return [{ id: source, source, content }];
  }
}
