import * as vscode from 'vscode';
import { activateExtension } from './bootstrap/activateExtension';

export function activate(
  context: vscode.ExtensionContext
): void {
  activateExtension(context);
}

export function deactivate(): void {}
