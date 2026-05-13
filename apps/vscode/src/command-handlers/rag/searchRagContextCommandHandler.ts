import { VSCodeContainer } from '../../dependencies/buildContainer';

export class SearchRagContextCommandHandler {
  constructor(private readonly container: VSCodeContainer) {}

  async handle(): Promise<void> {
    await this.container.notifications.info('RAG search is ready.');
  }
}
