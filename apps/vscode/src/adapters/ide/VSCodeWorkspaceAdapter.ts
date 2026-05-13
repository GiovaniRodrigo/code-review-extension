import * as vscode from 'vscode';
import { IdeWorkspacePort } from '@code-review/core';

export class VSCodeWorkspaceAdapter implements IdeWorkspacePort {
  getWorkspacePath(): string | undefined {
    return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  }

  async findFiles(pattern: string): Promise<string[]> {
    const files = await vscode.workspace.findFiles(pattern);
    return files.map(file => file.fsPath);
  }
}
