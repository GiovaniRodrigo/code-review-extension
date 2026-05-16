import * as vscode from 'vscode';
import { IdeNotificationPort } from '@code-review/core';

export class VSCodeNotificationAdapter implements IdeNotificationPort {
  async info(message: string): Promise<void> {
    const promise = vscode.window.showInformationMessage(message);
    if (process.env.CODE_REVIEW_E2E !== 'true') {
        await promise;
    }
  }

  async warning(message: string): Promise<void> {
    const promise = vscode.window.showWarningMessage(message);
    if (process.env.CODE_REVIEW_E2E !== 'true') {
        await promise;
    }
  }

  async error(message: string): Promise<void> {
    const promise = vscode.window.showErrorMessage(message);
    if (process.env.CODE_REVIEW_E2E !== 'true') {
        await promise;
    }
  }
}
