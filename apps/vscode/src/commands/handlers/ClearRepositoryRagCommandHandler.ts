import type { CommandHandlerPort } from '@code-review/core';
import type { VSCodeContainerPort } from '../../dependencies/types/VSCodeContainerPort';

export class ClearRepositoryRagCommandHandler implements CommandHandlerPort {
  constructor(private container: VSCodeContainerPort) {}

  async execute(): Promise<void> {
    try {
      await this.container.clearRepositoryRagUseCase.execute();
      await this.container.notifications.info('RAG index cleared.');
    } catch (e: any) {
      await this.container.notifications.error(`Failed to clear RAG: ${e.message}`);
    }
  }
}
