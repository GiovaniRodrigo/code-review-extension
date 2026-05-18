import * as vscode from 'vscode';
import { IdeCommandRegistryPort } from '@code-review/core';

export class VSCodeCommandRegistryAdapter implements IdeCommandRegistryPort {
  constructor(private readonly context: vscode.ExtensionContext) {}

  register(commandId: string, handler: (...args: unknown[]) => unknown): void {
    this.context.subscriptions.push(
      vscode.commands.registerCommand(commandId, async (...args: unknown[]) => {
        try { return await handler(...args); }
        catch (error: any) {
          const message = error?.message || String(error);
          console.error(`[Git Code Review] Command ${commandId} failed`, error);
          await vscode.window.showErrorMessage(`Code Review command failed: ${message}`);
          return undefined;
        }
      })
    );
  }
}
