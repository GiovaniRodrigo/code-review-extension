import { RepositorySyncInput, RepositorySyncPort, RepositorySyncResult } from '@code-review/core';

export class SelfHostedGitSyncProvider implements RepositorySyncPort {
  async sync(input: RepositorySyncInput): Promise<RepositorySyncResult> {
    return { provider: 'self-hosted', url: input.repositoryUrl, reference: input.reference };
  }
}
