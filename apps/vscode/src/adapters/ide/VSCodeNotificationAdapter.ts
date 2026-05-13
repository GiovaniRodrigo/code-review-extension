import * as vscode from 'vscode';
import { IdeNotificationPort } from '@code-review/core';

export class VSCodeNotificationAdapter implements IdeNotificationPort {
  async info(message: string): Promise<void> {
    await vscode.window.showInformationMessage(message);
  }

  async warning(message: string): Promise<void> {
    await vscode.window.showWarningMessage(message);
  }

  async error(message: string): Promise<void> {
    await vscode.window.showErrorMessage(message);
  }
}
