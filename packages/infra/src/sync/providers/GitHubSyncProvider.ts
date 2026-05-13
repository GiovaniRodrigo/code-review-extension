import type { RepositorySyncInput } from '../../../../core/src/ports/sync/RepositorySyncInput';
import type { RepositorySyncPort } from '../../../../core/src/ports/sync/RepositorySyncPort';
import type { RepositorySyncResult } from '../../../../core/src/ports/sync/RepositorySyncResult';

export class GitHubSyncProvider implements RepositorySyncPort {
  async sync(input: RepositorySyncInput): Promise<RepositorySyncResult> {
    return { provider: 'github', url: input.repositoryUrl, reference: input.reference };
  }
}
