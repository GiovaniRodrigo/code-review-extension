import { RagIndexingService } from '../../services/rag/RagIndexingService';

export class IndexRepositoryRagUseCase {
  constructor(private readonly service: RagIndexingService) {}

  execute(rootPath: string): Promise<void> {
    return this.service.indexRepository(rootPath);
  }
}
