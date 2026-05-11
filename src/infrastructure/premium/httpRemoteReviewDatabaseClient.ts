import { PremiumPlan } from '../../domain';
import { RemoteReviewDatabaseClient } from '../../application';

export class HttpRemoteReviewDatabaseClient implements RemoteReviewDatabaseClient {
  constructor(private readonly plan: PremiumPlan) {}

  async syncSessions(input: Parameters<RemoteReviewDatabaseClient['syncSessions']>[0]): Promise<{ remoteDatabase: string; syncedAt: string }> {
    if (!this.plan.remoteApiUrl || !this.plan.accessToken) {
      throw new Error('Configuracao premium incompleta para banco remoto.');
    }

    const endpoint = `${this.plan.remoteApiUrl.replace(/\/$/, '')}/review-sessions/sync`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${this.plan.accessToken}`
      },
      body: JSON.stringify(input)
    });

    if (!response.ok) {
      throw new Error(`Falha ao sincronizar banco premium: HTTP ${response.status}`);
    }

    const payload = await response.json().catch(() => ({})) as { remoteDatabase?: string; syncedAt?: string };
    return {
      remoteDatabase: payload.remoteDatabase ?? endpoint,
      syncedAt: payload.syncedAt ?? new Date().toISOString()
    };
  }
}
