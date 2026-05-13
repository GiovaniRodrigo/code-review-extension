import { VSCodeContainer } from '../../dependencies/buildContainer';

export class SyncWithVpsCommandHandler {
  constructor(private readonly container: VSCodeContainer) {}

  async handle(): Promise<void> {
    await this.container.notifications.info('VPS sync started.');
  }
}
