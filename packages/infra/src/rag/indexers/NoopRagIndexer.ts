import type { RagIndexerPort } from '../../../../core/src/ports/rag/RagIndexerPort';

export class NoopRagIndexer implements RagIndexerPort {
  async indexRepository(): Promise<void> {}
  async clear(): Promise<void> {}
}
