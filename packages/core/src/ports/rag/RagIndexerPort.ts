import { RagStatusDTO } from '../../application/dto/rag/RagDTO';

export interface RagIndexerPort {
  indexRepository(rootPath: string): Promise<void>;
  clear(): Promise<void>;
  getStatus(): Promise<RagStatusDTO>;
}
