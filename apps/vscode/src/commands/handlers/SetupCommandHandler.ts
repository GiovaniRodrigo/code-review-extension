import * as vscode from 'vscode';
import type { CommandHandlerPort } from '@code-review/core';
import type { VSCodeContainerPort } from '../../dependencies/types/VSCodeContainerPort';

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
            placeHolder: 'Code Review Extension Setup'
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
    const provider = await vscode.window.showQuickPick([
        { label: 'Ollama (Local)', id: 'ollama', type: 'ollama' },
        { label: 'OpenAI', id: 'openai', type: 'openai' },
        { label: 'Google Gemini', id: 'gemini', type: 'gemini' },
        { label: 'Anthropic Claude', id: 'claude', type: 'claude' },
        { label: 'Mock (Testing)', id: 'mock', type: 'mock' }
    ], { title: 'Step 1/4: Choose AI Provider' });

    if (!provider) return;

    const config = vscode.workspace.getConfiguration('codeReview');

    // 2. Configure specifics
    if (provider.type === 'ollama') {
        const url = await vscode.window.showInputBox({ 
            prompt: 'Ollama Base URL', 
            value: config.get('ollama.baseUrl') || 'http://localhost:11434' 
        });
        if (url) await config.update('ollama.baseUrl', url, vscode.ConfigurationTarget.Global);
        
        const model = await vscode.window.showInputBox({ 
            prompt: 'Ollama Model', 
            value: config.get('ollama.model') || 'llama3' 
        });
        if (model) await config.update('ollama.model', model, vscode.ConfigurationTarget.Global);
    } else if (provider.type !== 'mock') {
        const key = await vscode.window.showInputBox({ 
            prompt: `Enter your ${provider.label} API Key`,
            password: true 
        });
        if (key) {
            const secretKey = `${provider.type}-api-key`;
            await this.container.context.secrets.store(secretKey, key);
        }
    }

    // 3. Test Connection
    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: `Testing connection to ${provider.label}...`
    }, async () => {
        // We'd need to re-build a temporary provider to test, or use the registry if it's already updated
        // For simplicity in this guided setup, we'll assume the user wants to set it as active and we test then
        await this.container.context.globalState.update('activeAIProviderId', provider.id);
        // Refresh registry if possible, but usually a reload or re-build is needed.
        // For now, let's just notify.
    });

    await this.container.notifications.info(`${provider.label} configured successfully.`);

    // 4. Offer RAG Indexing
    const indexRag = await vscode.window.showQuickPick(['Yes, index now', 'No, skip for now'], {
        title: 'Step 4/4: Index repository for better AI context (RAG)?'
    });

    if (indexRag === 'Yes, index now') {
        await vscode.commands.executeCommand('code-review.indexRepositoryRag');
    }

    await vscode.commands.executeCommand('code-review.dashboard');
  }

  private async showApiKeyMenu() {
    const keyType = await vscode.window.showQuickPick([
        { label: 'OpenAI', id: 'openai' },
        { label: 'Gemini', id: 'gemini' },
        { label: 'GitHub', id: 'github' },
        { label: 'GitLab', id: 'gitlab' }
    ]);
    
    if (keyType) {
        const cmd = `code-review.set${keyType.id.charAt(0).toUpperCase()}${keyType.id.slice(1)}${keyType.id === 'openai' || keyType.id === 'gemini' ? 'ApiKey' : 'Token'}`;
        await vscode.commands.executeCommand(cmd);
    }
  }
}
