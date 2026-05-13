import * as vscode from 'vscode';
import { IdeStoragePort } from '@code-review/core';

export class VSCodeStorageAdapter implements IdeStoragePort {
  constructor(private readonly context: vscode.ExtensionContext) {}

  get<T>(key: string): T | undefined {
    return this.context.workspaceState.get<T>(key);
  }

  async set<T>(key: string, value: T): Promise<void> {
    await this.context.workspaceState.update(key, value);
  }

  async delete(key: string): Promise<void> {
    await this.context.workspaceState.update(key, undefined);
  }
}
