import { VSCodeContainer } from '../../dependencies/buildContainer';

export class PublishCodeReviewCommandHandler {
  constructor(private readonly container: VSCodeContainer) {}

  async handle(): Promise<void> {
    await this.container.notifications.info('Code review publish flow started.');
  }
}
