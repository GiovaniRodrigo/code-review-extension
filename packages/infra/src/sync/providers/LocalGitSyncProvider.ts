import type { RepositorySyncInput } from '../../../../core/src/ports/sync/RepositorySyncInput';
import type { RepositorySyncPort } from '../../../../core/src/ports/sync/RepositorySyncPort';
import type { RepositorySyncResult } from '../../../../core/src/ports/sync/RepositorySyncResult';

export class LocalGitSyncProvider implements RepositorySyncPort {
  async sync(input: RepositorySyncInput): Promise<RepositorySyncResult> {
    return { provider: 'local', url: input.repositoryUrl, reference: input.reference };
  }
}
