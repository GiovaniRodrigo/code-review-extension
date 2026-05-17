import * as vscode from 'vscode';
import type { CommandHandlerPort } from '@code-review/core';
import type { VSCodeContainerPort } from '../../dependencies/types/VSCodeContainerPort';

export class SetGeminiApiKeyCommandHandler implements CommandHandlerPort {
  constructor(private container: VSCodeContainerPort) {}

  async execute(): Promise<void> {
    const key = await vscode.window.showInputBox({ 
        prompt: 'Enter Gemini API Key',
        password: true 
    });
    if (key) {
        await this.container.context.secrets.store('gemini-api-key', key);
        await this.container.notifications.info('Gemini API Key stored securely.');
    }
  }
}
