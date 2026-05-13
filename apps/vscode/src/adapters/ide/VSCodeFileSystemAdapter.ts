import * as vscode from 'vscode';
import { Buffer } from 'node:buffer';
import { IdeFileSystemPort } from '@code-review/core';

export class VSCodeFileSystemAdapter implements IdeFileSystemPort {
  async readFile(path: string): Promise<string> {
    const content = await vscode.workspace.fs.readFile(vscode.Uri.file(path));
    return Buffer.from(content).toString('utf8');
  }

  async writeFile(path: string, content: string): Promise<void> {
    await vscode.workspace.fs.writeFile(
      vscode.Uri.file(path),
      Buffer.from(content, 'utf8')
    );
  }

  async exists(path: string): Promise<boolean> {
    try {
      await vscode.workspace.fs.stat(vscode.Uri.file(path));
      return true;
    } catch {
      return false;
    }
  }
}
