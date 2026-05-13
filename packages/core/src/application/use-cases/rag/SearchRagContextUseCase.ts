import { RagChunkDTO } from '../../dto/rag/RagDTO';
import { RagContextService } from '../../services/rag/RagContextService';

export class SearchRagContextUseCase {
  constructor(private readonly service: RagContextService) {}

  execute(query: string): Promise<RagChunkDTO[]> {
    return this.service.build(query);
  }
}
