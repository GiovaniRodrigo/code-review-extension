import { VSCodeContainer } from '../../dependencies/buildContainer';

export class ClearRepositoryRagCommandHandler {
  constructor(private readonly container: VSCodeContainer) {}

  async handle(): Promise<void> {
    await this.container.notifications.info('Repository RAG cache cleared.');
  }
}
