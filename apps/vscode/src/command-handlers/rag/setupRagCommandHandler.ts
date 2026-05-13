import { VSCodeContainer } from '../../dependencies/buildContainer';

export class SetupRagCommandHandler {
  constructor(private readonly container: VSCodeContainer) {}

  async handle(): Promise<void> {
    await this.container.notifications.info('RAG setup completed.');
  }
}
