import { RagIndexingService } from '../../services/rag/RagIndexingService';

export class ClearRepositoryRagUseCase {
  constructor(private readonly service: RagIndexingService) {}

  execute(): Promise<void> {
    return this.service.clear();
  }
}
