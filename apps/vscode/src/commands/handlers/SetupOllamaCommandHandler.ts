import * as vscode from 'vscode';
import type { CommandHandlerPort, AIProviderConfig } from '@code-review/core';
import type { VSCodeContainerPort } from '../../dependencies/types/VSCodeContainerPort';
import { AIProviderFactory } from '@code-review/infra';

export class SetupOllamaCommandHandler implements CommandHandlerPort {
  constructor(private readonly container: VSCodeContainerPort) {}

  async execute(): Promise<void> {
    const config = vscode.workspace.getConfiguration('codeReview');
    const baseUrl = await vscode.window.showInputBox({
      title: 'Setup Ollama Local AI',
      prompt: 'Ollama server URL. Keep the default if you run `ollama serve` locally.',
      value: config.get<string>('ollama.baseUrl', 'http://localhost:11434'),
      ignoreFocusOut: true
    });

    if (!baseUrl) return;

    const model = await vscode.window.showInputBox({
      title: 'Setup Ollama Local AI',
      prompt: 'Model name to use for local review.',
      value: config.get<string>('ollama.model', 'llama3'),
      placeHolder: 'llama3, deepseek-coder, codellama, qwen2.5-coder',
      ignoreFocusOut: true
    });

    if (!model) return;

    const providerConfig: AIProviderConfig = {
      id: 'ollama-local',
      label: 'Ollama (Local)',
      type: 'ollama' as any,
      baseUrl,
      model,
      enabled: true
    };

    const health = await vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: 'Git Code Review: validating Ollama...',
      cancellable: false
    }, async () => {
      const provider = AIProviderFactory.create(providerConfig);
      return provider.checkHealth();
    });

    if (health.status !== 'available') {
      const action = await vscode.window.showWarningMessage(
        `Ollama is not available: ${health.message || 'server did not respond'}.`,
        'Use Mock Provider',
        'Open Settings'
      );

      if (action === 'Use Mock Provider') {
        await config.update('provider', 'mock', vscode.ConfigurationTarget.Global);
        await config.update('ai.activeProviderId', 'mock', vscode.ConfigurationTarget.Global);
        this.container.aiProviderRegistry.setActiveProvider('mock');
        await this.container.dashboardProvider.refresh();
      }

      if (action === 'Open Settings') {
        await vscode.commands.executeCommand('workbench.action.openSettings', 'codeReview.ollama');
      }
      return;
    }

    await config.update('ollama.baseUrl', baseUrl, vscode.ConfigurationTarget.Global);
    await config.update('ollama.model', model, vscode.ConfigurationTarget.Global);
    await config.update('provider', 'ollama', vscode.ConfigurationTarget.Global);
    await config.update('ai.activeProviderId', 'ollama-local', vscode.ConfigurationTarget.Global);
    await this.container.context.globalState.update('activeAIProviderId', 'ollama-local');

    this.container.aiProviderRegistry.register('ollama-local', AIProviderFactory.create(providerConfig) as any);
    this.container.aiProviderRegistry.setActiveProvider('ollama-local');

    await this.container.dashboardProvider.refresh();
    await this.container.notifications.info(`Ollama configured with model ${model}.`);

    const indexNow = await vscode.window.showInformationMessage('Ollama is ready. Index this repository for local RAG context?', 'Index RAG', 'Later');
    if (indexNow === 'Index RAG') {
      await vscode.commands.executeCommand('code-review.indexRepositoryRag');
    }
  }
}
