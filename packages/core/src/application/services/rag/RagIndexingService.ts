import { RagIndexerPort } from '../../../ports/rag/RagIndexerPort';
import { RagStatusDTO } from '../../dto/rag/RagDTO';

export class RagIndexingService {
  constructor(private readonly indexer: RagIndexerPort) {}

  indexRepository(rootPath: string): Promise<void> {
    return this.indexer.indexRepository(rootPath);
  }

  clear(): Promise<void> {
    return this.indexer.clear();
  }

  getStatus(): Promise<RagStatusDTO> {
    return this.indexer.getStatus();
  }
}
