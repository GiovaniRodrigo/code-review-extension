import { RepositorySyncFactoryPort } from '../../../ports/sync/RepositorySyncFactoryPort';
import { RepositorySyncInput } from '../../../ports/sync/RepositorySyncInput';
import { RepositorySyncResult } from '../../../ports/sync/RepositorySyncResult';

export class RepositorySyncService {
  constructor(private readonly factory: RepositorySyncFactoryPort) {}

  sync(input: RepositorySyncInput): Promise<RepositorySyncResult> {
    return this.factory.create(input.provider).sync(input);
  }
}
