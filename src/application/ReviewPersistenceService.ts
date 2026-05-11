import { PremiumPlan } from '../domain';
import { ReviewSessionRepository, AuditService, RemoteReviewDatabaseClient } from './interfaces';
import { PremiumReviewSyncService } from './PremiumReviewSyncService';

export class ReviewPersistenceService {
  private readonly premiumSync: PremiumReviewSyncService;

  constructor(
    private readonly repository: ReviewSessionRepository,
    private readonly auditService?: AuditService,
    plan: PremiumPlan = { edition: 'community' },
    remoteClient?: RemoteReviewDatabaseClient
  ) {
    this.premiumSync = new PremiumReviewSyncService(repository, plan, remoteClient);
  }

  async exportLocalDatabase(): Promise<string> {
    return this.repository.exportDatabase?.() ?? JSON.stringify({ sessions: await this.repository.list() }, null, 2);
  }

  async createBackup(): Promise<string> {
    const result = await this.repository.createBackup?.();
    if (!result) throw new Error('Repositorio atual nao oferece backup local.');
    return result;
  }

  async syncRemote(targetPath?: string): Promise<string> {
    const result = await this.premiumSync.sync(targetPath);
    return JSON.stringify(result, null, 2);
  }

  async exportAuditData(): Promise<string> {
    return this.auditService?.exportData() ?? "";
  }
}
