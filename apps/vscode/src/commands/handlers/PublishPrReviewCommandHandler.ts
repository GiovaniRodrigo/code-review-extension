import type { CommandHandlerPort } from '@code-review/core';
import type { VSCodeContainerPort } from '../../dependencies/types/VSCodeContainerPort';

export class PublishPrReviewCommandHandler implements CommandHandlerPort {
  constructor(private container: VSCodeContainerPort) {}

  async execute(): Promise<void> {
    try {
      await this.container.publishCodeReviewUseCase.execute();
      await this.container.notifications.info('Review published successfully.');
    } catch (e: any) {
      await this.container.notifications.error(`Failed to publish: ${e.message}`);
    }
  }
}
