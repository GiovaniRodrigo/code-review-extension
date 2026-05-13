import { RagChunkDTO } from '../../dto/rag/RagDTO';
import { RagContextService } from './RagContextService';
import { RagIndexingService } from './RagIndexingService';

export class RagOrchestratorService {
  constructor(
    private readonly indexingService: RagIndexingService,
    private readonly contextService: RagContextService
  ) {}

  index(rootPath: string): Promise<void> {
    return this.indexingService.indexRepository(rootPath);
  }

  search(query: string): Promise<RagChunkDTO[]> {
    return this.contextService.build(query);
  }
}
