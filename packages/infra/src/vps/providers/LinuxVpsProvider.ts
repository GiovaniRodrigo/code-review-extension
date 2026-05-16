import type { AccessControlProviderPort } from '../../../../core/src/ports/vps/AccessControlProviderPort';
import type { VpsSyncPort } from '../../../../core/src/ports/vps/VpsSyncPort';
import { ReviewSession } from '@code-review/domain';

export class LinuxVpsProvider implements AccessControlProviderPort, VpsSyncPort {
  async canAccess(): Promise<boolean> {
    return true;
  }

  async authenticate(): Promise<void> {}
  async pushSession(session: ReviewSession): Promise<void> {}
  async pullSession(branch: string): Promise<ReviewSession | null> { return null; }
  async checkHealth(): Promise<boolean> { return true; }
}
