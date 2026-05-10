import { ReviewSessionRepository, AuditService } from './interfaces';

export class ReviewPersistenceService {
  constructor(
    private readonly repository: ReviewSessionRepository,
    private readonly auditService?: AuditService
  ) {}

  async exportLocalDatabase(): Promise<string> {
    return this.repository.exportDatabase?.() ?? JSON.stringify({ sessions: await this.repository.list() }, null, 2);
  }

  async createBackup(): Promise<string> {
    const result = await this.repository.createBackup?.();
    if (!result) throw new Error('Repositorio atual nao oferece backup local.');
    return result;
  }

  async syncRemote(targetPath?: string): Promise<string> {
    const result = await this.repository.syncToRemote?.(targetPath);
    if (!result) throw new Error('Repositorio atual nao oferece sincronizacao remota.');
    return result;
  }

  async exportAuditData(): Promise<string> {
    return this.auditService?.exportData() ?? "";
  }
}
