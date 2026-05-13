import { RagIndexerPort } from '../../../ports/rag/RagIndexerPort';

export class RagIndexingService {
  constructor(private readonly indexer: RagIndexerPort) {}

  indexRepository(rootPath: string): Promise<void> {
    return this.indexer.indexRepository(rootPath);
  }

  clear(): Promise<void> {
    return this.indexer.clear();
  }
}
