import * as vscode from 'vscode';
import type { CommandHandlerPort } from '@code-review/core';
import type { VSCodeContainerPort } from '../../dependencies/types/VSCodeContainerPort';
import { AIProviderFactory } from '@code-review/infra';

export class SetProviderCommandHandler implements CommandHandlerPort {
  constructor(private container: VSCodeContainerPort) {}

  async execute(): Promise<void> {
    try {
      const { getAIProviderConfigs } = await import('../../dependencies/getAIProviderConfigs');
      const providers = await getAIProviderConfigs(this.container.context);
      const config = vscode.workspace.getConfiguration('codeReview');

      if (providers.length === 0) {
        await this.container.notifications.warning('No AI providers configured in settings.');
        return;
      }

      await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Checking AI Providers health...',
        cancellable: false
      }, async () => {
        const results = await this.container.discoverAIProvidersUseCase.execute(
            providers,
            (pc) => AIProviderFactory.create(pc) as any
        );

        const available = results.filter(r => r.status.status === 'available');

        if (available.length === 0) {
            const firstError = results.find(r => r.status.status !== 'available');
            throw new Error(`No providers available. First error: ${firstError?.status.message || 'Unknown'}`);
        }

        if (available.length === 1) {
            const selected = available[0];
            await config.update('ai.activeProviderId', selected.config.id, vscode.ConfigurationTarget.Global);
            this.container.aiProviderRegistry.setActiveProvider(selected.config.id);
            await vscode.commands.executeCommand('code-review.chat.refresh');
            await this.container.notifications.info(`AI Provider "${selected.config.label}" selected automatically.`);
            return;
        }

        const items = available.map(r => ({
            label: r.config.label,
            description: r.config.model,
            detail: r.config.type,
            id: r.config.id
        }));

        const picked = await vscode.window.showQuickPick(items, {
            placeHolder: 'Select an AI Provider'
        });

        if (picked && typeof picked === 'object') {
            const pickedItem = picked as any;
            await config.update('ai.activeProviderId', pickedItem.id, vscode.ConfigurationTarget.Global);
            this.container.aiProviderRegistry.setActiveProvider(pickedItem.id);
            await vscode.commands.executeCommand('code-review.chat.refresh');
            await this.container.notifications.info(`AI Provider "${pickedItem.label}" selected.`);
        }
      });
    } catch (e: any) {
      await this.container.notifications.error(`Failed to discover providers: ${e.message}`);
    }
  }
}
