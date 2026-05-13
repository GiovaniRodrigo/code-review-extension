import * as vscode from 'vscode';
import { ExtensionBootstrap } from './bootstrap/ExtensionBootstrap';

export function activate(
  context: vscode.ExtensionContext
): void {
  new ExtensionBootstrap(context).initialize();
}

export function deactivate(): void {}