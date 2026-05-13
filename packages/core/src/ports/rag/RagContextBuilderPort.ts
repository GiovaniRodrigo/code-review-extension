import { RagChunkDTO } from '../../application/dto/rag/RagDTO';

export interface RagContextBuilderPort {
  buildContext(query: string): Promise<RagChunkDTO[]>;
}
