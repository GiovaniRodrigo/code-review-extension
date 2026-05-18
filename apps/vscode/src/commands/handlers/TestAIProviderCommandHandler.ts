import * as vscode from 'vscode';
import type { CommandHandlerPort } from '@code-review/core';
import type { VSCodeContainerPort } from '../../dependencies/types/VSCodeContainerPort';

export class TestAIProviderCommandHandler implements CommandHandlerPort {
  constructor(private readonly container: VSCodeContainerPort) {}

  async execute(): Promise<void> {
    try {
      await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Testing active AI provider...',
        cancellable: false
      }, async () => {
        const health = await this.container.aiProviderRegistry.checkHealth();
        const activeProvider = await vscode.workspace.getConfiguration('codeReview').get<string>('ai.activeProviderId', 'mock');
        const status = health?.status || 'unknown';
        const message = health?.message ? ` — ${health.message}` : '';

        if (status === 'available') {
          await this.container.notifications.info(`AI provider is available: ${activeProvider}.`);
          return;
        }

        await this.container.notifications.warning(`AI provider status: ${status}${message}`);
      });
    } catch (error: any) {
      await this.container.notifications.error(`AI provider test failed: ${error?.message || String(error)}`);
    }
  }
}
