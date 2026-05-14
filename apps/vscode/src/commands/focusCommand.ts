import * as vscode from 'vscode';
import { VSCodeContainer } from '../dependencies/buildContainer';

export const focusCommand = {
  id: 'code-review.focus',
  async execute(container: VSCodeContainer) {
    vscode.commands.executeCommand('workbench.view.extension.code-review');
  }
};
