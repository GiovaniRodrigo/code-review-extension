import { RepositorySyncInput, RepositorySyncPort, RepositorySyncResult } from '@code-review/core';

export class BitbucketSyncProvider implements RepositorySyncPort {
  async sync(input: RepositorySyncInput): Promise<RepositorySyncResult> {
    return { provider: 'bitbucket', url: input.repositoryUrl, reference: input.reference };
  }
}
