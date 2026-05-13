import { RepositorySyncInput, RepositorySyncPort, RepositorySyncResult } from '@code-review/core';

export class GitHubSyncProvider implements RepositorySyncPort {
  async sync(input: RepositorySyncInput): Promise<RepositorySyncResult> {
    return { provider: 'github', url: input.repositoryUrl, reference: input.reference };
  }
}
