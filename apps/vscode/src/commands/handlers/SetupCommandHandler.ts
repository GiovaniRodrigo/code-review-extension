import * as vscode from 'vscode';
import type { CommandHandlerPort } from '@code-review/core';
import type { VSCodeContainerPort } from '../../dependencies/types/VSCodeContainerPort';

export class SetupCommandHandler implements CommandHandlerPort {
  constructor(private container: VSCodeContainerPort) {}

  async execute(): Promise<void> {
    try {
        const selection = await vscode.window.showQuickPick([
            { label: '$(gear) Configure AI Provider', id: 'provider' },
            { label: '$(key) Set API Keys', id: 'keys' },
            { label: '$(database) Setup RAG / Indexing', id: 'rag' },
            { label: '$(sync) Full Setup (Guided)', id: 'full' }
        ], {
            placeHolder: 'Extension Guided Setup'
        });

        if (!selection) return;

        switch (selection.id) {
            case 'provider':
                await vscode.commands.executeCommand('code-review.setProvider');
                break;
            case 'keys':
                await this.showApiKeyMenu();
                break;
            case 'rag':
                await vscode.commands.executeCommand('code-review.setupRag');
                break;
            case 'full':
                await vscode.commands.executeCommand('workbench.action.openSettings', 'codeReview');
                break;
        }
    } catch (e: any) {
        await this.container.notifications.error(`Setup error: ${e.message}`);
    }
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
