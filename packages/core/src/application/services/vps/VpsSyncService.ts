import { ReviewSession } from '@code-review/domain';
import { VpsSyncPort } from '../../../ports/vps/VpsSyncPort';
import { CodeReviewRepositoryPort } from '../../../ports/review/CodeReviewRepositoryPort';

export class VpsSyncService {
  constructor(
    private readonly vpsPort: VpsSyncPort,
    private readonly repository: CodeReviewRepositoryPort
  ) {}

  async syncSession(branch: string): Promise<void> {
    const localSession = await this.repository.getSessionByBranch(branch);
    const remoteSession = await this.vpsPort.pullSession(branch);

    if (!localSession && !remoteSession) return;

    if (!localSession && remoteSession) {
      await this.repository.saveSession(remoteSession);
      return;
    }

    if (localSession && !remoteSession) {
      await this.vpsPort.pushSession(localSession);
      return;
    }

    if (localSession && remoteSession) {
      // Simple strategy: newer updatedAt wins
      if (remoteSession.updatedAt > localSession.updatedAt) {
        await this.repository.saveSession(remoteSession);
      } else if (localSession.updatedAt > remoteSession.updatedAt) {
        await this.vpsPort.pushSession(localSession);
      }
    }
  }
}
