import { RepositorySyncInput } from './RepositorySyncInput';
import { RepositorySyncResult } from './RepositorySyncResult';

export interface RepositorySyncPort {
  sync(input: RepositorySyncInput): Promise<RepositorySyncResult>;
}
