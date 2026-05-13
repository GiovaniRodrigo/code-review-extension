import { AccessControlProviderPort } from '../../../ports/vps/AccessControlProviderPort';

export class VpsAccessService {
  constructor(private readonly accessControl: AccessControlProviderPort) {}

  canAccess(resource: string): Promise<boolean> {
    return this.accessControl.canAccess(resource);
  }
}
