export type SyncProviderType =
  | 'github'
  | 'gitlab'
  | 'bitbucket'
  | 'local'
  | 'self-hosted';

export interface SyncProvider {
  type: SyncProviderType;
  name: string;
  baseUrl?: string;
}
