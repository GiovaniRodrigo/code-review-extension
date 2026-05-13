import { VSCodeContainer } from '../../dependencies/buildContainer';

export class IndexRepositoryRagCommandHandler {
  constructor(private readonly container: VSCodeContainer) {}

  async handle(): Promise<void> {
    await this.container.notifications.info('Repository RAG indexing started.');
  }
}
