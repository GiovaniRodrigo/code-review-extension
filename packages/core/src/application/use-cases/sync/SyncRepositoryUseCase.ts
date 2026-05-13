import { RepositorySyncInput } from '../../../ports/sync/RepositorySyncInput';
import { RepositorySyncResult } from '../../../ports/sync/RepositorySyncResult';
import { RepositorySyncService } from '../../services/sync/RepositorySyncService';

export class SyncRepositoryUseCase {
  constructor(private readonly service: RepositorySyncService) {}

  execute(input: RepositorySyncInput): Promise<RepositorySyncResult> {
    return this.service.sync(input);
  }
}
