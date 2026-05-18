import * as vscode from 'vscode';
import type { CommandHandlerPort, AIProviderConfig } from '@code-review/core';
import type { VSCodeContainerPort } from '../../dependencies/types/VSCodeContainerPort';
import { AIProviderFactory } from '@code-review/infra';

export class SetupCommandHandler implements CommandHandlerPort {
  constructor(private container: VSCodeContainerPort) {}

  async execute(): Promise<void> {
    try {
        const action = await vscode.window.showQuickPick([
            { label: '$(sync) Start Guided Setup', id: 'guided', detail: 'Step-by-step configuration' },
            { label: '$(gear) Quick Configure AI', id: 'provider', detail: 'Change active provider' },
            { label: '$(key) Manage API Keys', id: 'keys' },
            { label: '$(database) RAG Management', id: 'rag' }
        ], {
            placeHolder: 'Git Code Review Setup'
        });

        if (!action) return;

        if (action.id === 'guided') {
            await this.runGuidedSetup();
        } else if (action.id === 'provider') {
            await vscode.commands.executeCommand('code-review.setProvider');
        } else if (action.id === 'keys') {
            await this.showApiKeyMenu();
        } else if (action.id === 'rag') {
            await vscode.commands.executeCommand('code-review.setupRag');
        }
    } catch (e: any) {
        await this.container.notifications.error(`Setup error: ${e.message}`);
    }
  }

  private async runGuidedSetup() {
    // 1. Select Provider
    const selected = await vscode.window.showQuickPick([
        { label: 'Ollama (Local)', id: 'ollama-local', type: 'ollama' },
        { label: 'OpenAI', id: 'openai-cloud', type: 'openai' },
        { label: 'Google Gemini', id: 'gemini-pro', type: 'gemini' },
        { label: 'Anthropic Claude', id: 'claude-3-5', type: 'claude' },
        { label: 'Mock (Testing)', id: 'mock', type: 'mock' }
    ], { title: 'Step 1/4: Choose AI Provider' });

    if (!selected) return;

    const config = vscode.workspace.getConfiguration('codeReview');
    const testConfig: AIProviderConfig = {
        id: selected.id,
        type: selected.type as any,
        label: selected.label,
        model: '',
        enabled: true
    };

    // 2. Configure specifics
    if (selected.type === 'ollama') {
        const url = await vscode.window.showInputBox({ 
            prompt: 'Ollama Base URL', 
            value: config.get('ollama.baseUrl') || 'http://localhost:11434' 
        });
        if (!url) return;
        testConfig.baseUrl = url;
        
        const model = await vscode.window.showInputBox({ 
            prompt: 'Ollama Model', 
            value: config.get('ollama.model') || 'llama3' 
        });
        if (!model) return;
        testConfig.model = model;
    } else if (selected.type !== 'mock') {
        const key = await vscode.window.showInputBox({ 
            prompt: `Enter your ${selected.label} API Key`,
            password: true,
            validateInput: (value) => {
                if (!value || value.trim().length < 20) return 'API Key is too short or invalid.';
                return null;
            }
        });
        if (!key) return;
        testConfig.apiKey = key;
        
        // Default models
        if (selected.type === 'openai') testConfig.model = config.get('openai.model') || 'gpt-4o-mini';
        if (selected.type === 'gemini') testConfig.model = config.get('gemini.model') || 'gemini-flash-latest';
        if (selected.type === 'claude') testConfig.model = 'claude-3-5-sonnet-20240620';
    } else {
        testConfig.model = 'mock-model';
    }

    // 3. Test Connection
    const success = await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: `Validating connection to ${selected.label}...`,
        cancellable: false
    }, async () => {
        try {
            const providerInstance = AIProviderFactory.create(testConfig);
            const health = await providerInstance.checkHealth();
            
            if (health.status !== 'available') {
                throw new Error(health.message || 'Provider reported as unavailable.');
            }
            return true;
        } catch (e: any) {
            await this.container.notifications.error(`Validation failed for ${selected.label}: ${e.message}`);
            return false;
        }
    });

    if (!success) return;

    // 4. Save and Activate
    if (selected.type === 'ollama') {
        await config.update('ollama.baseUrl', testConfig.baseUrl, vscode.ConfigurationTarget.Global);
        await config.update('ollama.model', testConfig.model, vscode.ConfigurationTarget.Global);
    } else if (selected.type !== 'mock') {
        const secretKey = `${selected.type}-api-key`;
        await this.container.context.secrets.store(secretKey, testConfig.apiKey as string);
    }

    await this.container.context.globalState.update('activeAIProviderId', selected.id);
    
    // Sync with registry
    try {
        // We might need to refresh registry config reading here if it uses getAIProviderConfigs
        this.container.aiProviderRegistry.register(selected.id, AIProviderFactory.create(testConfig) as any);
        this.container.aiProviderRegistry.setActiveProvider(selected.id);
    } catch (e: any) {
        console.warn(`[SETUP] Registry sync error: ${e.message}`);
    }

    // Update the dual config (legacy codeReview.provider and new activeProviderId)
    await config.update('provider', selected.type, vscode.ConfigurationTarget.Global);
    await config.update('ai.activeProviderId', selected.id, vscode.ConfigurationTarget.Global);

    await vscode.commands.executeCommand('code-review.chat.refresh');
    await this.container.notifications.info(`${selected.label} configured and activated successfully.`);

    // 5. Offer RAG Indexing
    const indexRag = await vscode.window.showQuickPick(['Yes, index now', 'No, skip for now'], {
        title: 'Step 4/4: Index repository for better AI context (RAG)?'
    });

    if (indexRag === 'Yes, index now') {
        await vscode.commands.executeCommand('code-review.indexRepositoryRag');
    }

    await vscode.commands.executeCommand('code-review.focus');
  }

  private async showApiKeyMenu() {
    const keyType = await vscode.window.showQuickPick([
        { label: 'OpenAI', id: 'openai' },
        { label: 'Gemini', id: 'gemini' },
        { label: 'GitHub', id: 'github' },
        { label: 'GitLab', id: 'gitlab' }
    ]);
    
    if (keyType) {
        const commandByKeyType: Record<string, string> = {
          openai: 'code-review.setOpenAIApiKey',
          gemini: 'code-review.setGeminiApiKey',
          github: 'code-review.setGitHubToken',
          gitlab: 'code-review.setGitLabToken'
        };
        await vscode.commands.executeCommand(commandByKeyType[keyType.id]);
    }
  }
}
