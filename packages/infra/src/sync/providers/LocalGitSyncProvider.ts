import { RepositorySyncInput, RepositorySyncPort, RepositorySyncResult } from '@code-review/core';

export class LocalGitSyncProvider implements RepositorySyncPort {
  async sync(input: RepositorySyncInput): Promise<RepositorySyncResult> {
    return { provider: 'local', url: input.repositoryUrl, reference: input.reference };
  }
}
