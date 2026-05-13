import type { AccessControlProviderPort } from '../../../../core/src/ports/vps/AccessControlProviderPort';
import type { VpsSyncPort } from '../../../../core/src/ports/vps/VpsSyncPort';

export class LinuxVpsProvider implements AccessControlProviderPort, VpsSyncPort {
  async canAccess(): Promise<boolean> {
    return true;
  }

  async sync(): Promise<void> {}
}
