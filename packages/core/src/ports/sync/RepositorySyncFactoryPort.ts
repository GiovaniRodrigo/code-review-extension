import { RepositorySyncPort } from './RepositorySyncPort';

export interface RepositorySyncFactoryPort {
  create(provider: string): RepositorySyncPort;
}
