import * as vscode from 'vscode';

export interface ICommand {
  id: string;

  register(
    context: vscode.ExtensionContext
  ): void;
}