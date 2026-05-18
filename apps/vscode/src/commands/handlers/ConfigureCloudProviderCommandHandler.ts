import * as vscode from 'vscode';
import type { AIProviderConfig, CommandHandlerPort } from '@code-review/core';
import { AIProviderFactory } from '@code-review/infra';
import type { VSCodeContainerPort } from '../../dependencies/types/VSCodeContainerPort';

interface ProviderChoice {
  id: string;
  label: string;
  type: AIProviderConfig['type'];
  defaultModel: string;
  secretKey: string;
  baseUrl?: string;
  detail: string;
}

const PROVIDERS: ProviderChoice[] = [
  {
    id: 'openai-cloud',
    label: 'OpenAI Cloud',
    type: 'openai',
    defaultModel: 'gpt-4o-mini',
    secretKey: 'openai-api-key',
    detail: 'Pro-ready cloud review provider for PR summaries, reports and code analysis.'
  },
  {
    id: 'gemini-pro',
    label: 'Gemini Pro',
    type: 'gemini',
    defaultModel: 'gemini-flash-latest',
    secretKey: 'gemini-api-key',
    detail: 'Google Gemini provider for cloud-assisted review workflows.'
  },
  {
    id: 'claude-pro',
    label: 'Claude',
    type: 'claude',
    defaultModel: 'claude-3-5-sonnet-20240620',
    secretKey: 'claude-api-key',
    detail: 'Anthropic Claude provider for architecture and quality-focused review.'
  },
  {
    id: 'custom-cloud',
    label: 'Custom OpenAI-compatible endpoint',
    type: 'cloud',
    defaultModel: 'gpt-4o-mini',
    secretKey: 'custom-cloud-api-key',
    baseUrl: '',
    detail: 'Use a compatible endpoint controlled by the reviewer or organization.'
  }
];

export class ConfigureCloudProviderCommandHandler implements CommandHandlerPort {
  constructor(private readonly container: VSCodeContainerPort) {}

  async execute(): Promise<void> {
    try {
      const picked = await vscode.window.showQuickPick(
        PROVIDERS.map(provider => ({
          label: provider.label,
          description: provider.type,
          detail: provider.detail,
          provider
        })),
        {
          title: 'Git Code Review — Configure Cloud Provider',
          placeHolder: 'Select the Pro provider to configure'
        }
      );

      if (!picked) return;
      const provider = picked.provider;

      const model = await vscode.window.showInputBox({
        title: `${provider.label} model`,
        prompt: 'Choose the model used for Pro review workflows.',
        value: provider.defaultModel,
        ignoreFocusOut: true
      });
      if (!model) return;

      let baseUrl = provider.baseUrl;
      if (provider.type === 'cloud') {
        baseUrl = await vscode.window.showInputBox({
          title: 'Custom cloud endpoint',
          prompt: 'Enter the OpenAI-compatible base URL used by your provider.',
          placeHolder: 'https://api.example.com/v1',
          ignoreFocusOut: true
        });
        if (!baseUrl) return;
      }

      const apiKey = await vscode.window.showInputBox({
        title: `${provider.label} API key`,
        prompt: 'Stored securely in VS Code Secret Storage. It is not written to settings.json.',
        password: true,
        ignoreFocusOut: true
      });
      if (!apiKey) return;

      await this.container.context.secrets.store(provider.secretKey, apiKey);

      const config = vscode.workspace.getConfiguration('codeReview');
      const existing = config.get<AIProviderConfig[]>('ai.providers', []) || [];
      const providerConfig: AIProviderConfig = {
        id: provider.id,
        label: provider.label,
        type: provider.type,
        model,
        enabled: true,
        baseUrl,
        apiKey: async () => (await this.container.context.secrets.get(provider.secretKey)) || ''
      };

      const nextProviders = [
        ...existing.filter(item => item.id !== provider.id),
        {
          id: providerConfig.id,
          label: providerConfig.label,
          type: providerConfig.type,
          model: providerConfig.model,
          enabled: providerConfig.enabled,
          baseUrl: providerConfig.baseUrl
        }
      ];

      await config.update('ai.providers', nextProviders, vscode.ConfigurationTarget.Global);
      await config.update('ai.activeProviderId', providerConfig.id, vscode.ConfigurationTarget.Global);
      await config.update('product.plan', 'pro', vscode.ConfigurationTarget.Global);

      this.container.aiProviderRegistry.register(providerConfig.id, AIProviderFactory.create(providerConfig) as any);
      this.container.aiProviderRegistry.setActiveProvider(providerConfig.id);
      await this.container.context.globalState.update('activeAIProviderId', providerConfig.id);
      await vscode.commands.executeCommand('code-review.chat.refresh');

      const testNow = await vscode.window.showInformationMessage(
        `${provider.label} configured as the active Pro provider.`,
        'Test Connection',
        'Generate PR Summary',
        'Done'
      );

      if (testNow === 'Test Connection') await vscode.commands.executeCommand('code-review.testAIProvider');
      if (testNow === 'Generate PR Summary') await vscode.commands.executeCommand('code-review.generatePRSummary');
    } catch (error: any) {
      await this.container.notifications.error(`Failed to configure cloud provider: ${error?.message || String(error)}`);
    }
  }
}
