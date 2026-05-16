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

    // 1. If only remote exists, download it
    if (!localSession && remoteSession) {
      await this.repository.saveSession(remoteSession);
      return;
    }

    // 2. If only local exists, upload it
    if (localSession && !remoteSession) {
      await this.vpsPort.pushSession(localSession);
      return;
    }

    // 3. Both exist - Perform Deep Merge
    if (localSession && remoteSession) {
      const mergedSession = this._mergeSessions(localSession, remoteSession);
      
      // Update both if there was a change
      const localChanged = mergedSession.updatedAt.getTime() !== localSession.updatedAt.getTime();
      const remoteChanged = mergedSession.updatedAt.getTime() !== remoteSession.updatedAt.getTime();

      if (localChanged) {
          await this.repository.saveSession(mergedSession);
      }
      
      if (remoteChanged) {
          await this.vpsPort.pushSession(mergedSession);
      }
    }
  }

  private _mergeSessions(local: ReviewSession, remote: ReviewSession): ReviewSession {
      const allFindings = [...local.findings];
      let changed = false;

      // Remote findings take precedence if they are different
      remote.findings.forEach(remoteF => {
          const localIndex = allFindings.findIndex(f => f.id === remoteF.id);
          if (localIndex === -1) {
              allFindings.push(remoteF);
              changed = true;
          } else {
              const localF = allFindings[localIndex];
              if (localF.status !== remoteF.status || localF.discussion?.length !== remoteF.discussion?.length) {
                  // Conflict resolution: newer updatedAt for that specific session usually wins, 
                  // but here we'll take remote if it has more data (e.g. comments)
                  allFindings[localIndex] = remote.updatedAt > local.updatedAt ? remoteF : localF;
                  changed = true;
              }
          }
      });

      return {
          ...local,
          findings: allFindings,
          updatedAt: changed ? new Date() : (local.updatedAt > remote.updatedAt ? local.updatedAt : remote.updatedAt)
      };
  }
}
