import { RagChunkDTO } from '../../application/dto/rag/RagDTO';

export interface RagVectorStorePort {
  add(chunk: RagChunkDTO, vector: number[]): Promise<void>;
  search(vector: number[], limit: number): Promise<RagChunkDTO[]>;
  deleteBySource(source: string): Promise<void>;
  clear(): Promise<void>;
}
