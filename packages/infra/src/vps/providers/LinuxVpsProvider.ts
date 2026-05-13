import { AccessControlProviderPort, VpsSyncPort } from '@code-review/core';

export class LinuxVpsProvider implements AccessControlProviderPort, VpsSyncPort {
  async canAccess(): Promise<boolean> {
    return true;
  }

  async sync(): Promise<void> {}
}
