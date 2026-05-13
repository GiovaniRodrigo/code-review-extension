import * as vscode from 'vscode';
import { IdeCommandRegistryPort } from '@code-review/core';

export class VSCodeCommandRegistryAdapter implements IdeCommandRegistryPort {
  constructor(private readonly context: vscode.ExtensionContext) {}

  register(commandId: string, handler: (...args: unknown[]) => unknown): void {
    this.context.subscriptions.push(
      vscode.commands.registerCommand(commandId, handler)
    );
  }
}
