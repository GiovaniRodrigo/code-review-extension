import { RagIndexerPort } from '@code-review/core';

export class NoopRagIndexer implements RagIndexerPort {
  async indexRepository(): Promise<void> {}
  async clear(): Promise<void> {}
}
