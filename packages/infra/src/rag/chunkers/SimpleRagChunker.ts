import { RagChunkDTO, RagChunkerPort } from '@code-review/core';

export class SimpleRagChunker implements RagChunkerPort {
  async chunk(content: string, source: string): Promise<RagChunkDTO[]> {
    return [{ id: source, source, content }];
  }
}
