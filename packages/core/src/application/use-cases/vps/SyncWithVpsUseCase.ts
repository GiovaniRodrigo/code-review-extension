import { VpsSyncPort } from '../../../ports/vps/VpsSyncPort';

export class SyncWithVpsUseCase {
  constructor(private readonly syncPort: VpsSyncPort) {}

  execute(): Promise<void> {
    return this.syncPort.sync();
  }
}
