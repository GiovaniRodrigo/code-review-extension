import { RepositorySyncInput, RepositorySyncPort, RepositorySyncResult } from '@code-review/core';

export class GitLabSyncProvider implements RepositorySyncPort {
  async sync(input: RepositorySyncInput): Promise<RepositorySyncResult> {
    return { provider: 'gitlab', url: input.repositoryUrl, reference: input.reference };
  }
}
