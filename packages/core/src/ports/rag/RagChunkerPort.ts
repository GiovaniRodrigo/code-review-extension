import { RagChunkDTO } from '../../application/dto/rag/RagDTO';

export interface RagChunkerPort {
  chunk(content: string, source: string): Promise<RagChunkDTO[]>;
}
