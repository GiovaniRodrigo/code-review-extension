export interface SyncSession {
  id: string;
  provider: string;
  reference?: string;
  startedAt: Date;
  finishedAt?: Date;
  status: 'pending' | 'running' | 'completed' | 'failed';
}
