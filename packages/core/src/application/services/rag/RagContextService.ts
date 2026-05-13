import { RagContextBuilderPort } from '../../../ports/rag/RagContextBuilderPort';
import { RagChunkDTO } from '../../dto/rag/RagDTO';

export class RagContextService {
  constructor(private readonly contextBuilder: RagContextBuilderPort) {}

  build(query: string): Promise<RagChunkDTO[]> {
    return this.contextBuilder.buildContext(query);
  }
}
