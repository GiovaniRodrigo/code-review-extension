import { RagChunkDTO } from '../../application/dto/rag/RagDTO';

export interface RagVectorStorePort {
  add(chunk: RagChunkDTO, vector: number[]): Promise<void>;
  search(vector: number[], limit: number): Promise<RagChunkDTO[]>;
  clear(): Promise<void>;
}
