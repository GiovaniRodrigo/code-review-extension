import { VpsSyncService } from '../../services/vps/VpsSyncService';

export class SyncWithVpsUseCase {
  constructor(private readonly syncService: VpsSyncService) {}

  async execute(branch: string): Promise<void> {
    await this.syncService.syncSession(branch);
  }
}
