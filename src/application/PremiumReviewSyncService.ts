import { PremiumPlan, ReviewSession, assertPremiumFeature, hasRemoteDatabaseConfiguration } from '../domain';
import { RemoteReviewDatabaseClient, ReviewSessionRepository } from './interfaces';

export interface PremiumSyncResult {
  mode: 'community-local' | 'premium-remote';
  target: string;
  sessionsSynced: number;
  syncedAt: string;
}

export class PremiumReviewSyncService {
  constructor(
    private readonly repository: ReviewSessionRepository,
    private readonly plan: PremiumPlan,
    private readonly remoteClient?: RemoteReviewDatabaseClient
  ) {}

  async sync(targetPath?: string): Promise<PremiumSyncResult> {
    if (this.plan.edition !== 'premium') {
      const target = await this.syncCommunitySnapshot(targetPath);
      return {
        mode: 'community-local',
        target,
        sessionsSynced: (await this.repository.list()).length,
        syncedAt: new Date().toISOString()
      };
    }

    assertPremiumFeature(this.plan, 'remoteDatabase');

    if (!hasRemoteDatabaseConfiguration(this.plan)) {
      throw new Error('Versao premium requer giovaniCodeReview.premiumApiUrl e giovaniCodeReview.premiumToken para sincronizar o banco remoto.');
    }

    if (!this.remoteClient) {
      throw new Error('Cliente remoto premium nao configurado.');
    }

    const sessions = await this.repository.list();
    const result = await this.remoteClient.syncSessions({
      organizationId: this.plan.organizationId ?? 'default',
      workspaceId: this.plan.workspaceId ?? 'default',
      sessions
    });

    return {
      mode: 'premium-remote',
      target: result.remoteDatabase,
      sessionsSynced: sessions.length,
      syncedAt: result.syncedAt
    };
  }

  private async syncCommunitySnapshot(targetPath?: string): Promise<string> {
    const result = await this.repository.syncToRemote?.(targetPath);
    if (!result) throw new Error('Repositorio atual nao oferece exportacao local de snapshot.');
    return result;
  }
}
