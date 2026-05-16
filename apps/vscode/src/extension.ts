import * as vscode from 'vscode';
import { activateExtension } from './bootstrap/activateExtension';

export async function activate(
  context: vscode.ExtensionContext
): Promise<void> {
  await activateExtension(context);
}

export function deactivate(): void {}
