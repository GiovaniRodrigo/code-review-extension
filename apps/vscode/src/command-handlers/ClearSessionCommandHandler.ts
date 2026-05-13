import * as vscode from 'vscode';

import { ICommandHandler }
  from '../contracts/ICommandHandler';

import { IExtensionDependencies }
  from '../contracts/IExtensionDependencies';

export class ClearSessionCommandHandler
  implements ICommandHandler {

  constructor(
    private readonly dependencies: IExtensionDependencies
  ) { }

  async execute(): Promise<void> {

    const {
      vscodeAdapter,
      reviewViewProvider
    } = this.dependencies;

    try {

      const branch =
        await vscodeAdapter.getActiveBranch();

      reviewViewProvider.clear(
        `Review session cleared for branch ${branch}.`
      );

      vscode.window.showInformationMessage(
        `Review session cleared for branch ${branch}.`
      );

    } catch (error: any) {

      const message =
        `Could not clear review session: ${error.message}`;

      reviewViewProvider.setError(message);

      vscode.window.showErrorMessage(message);
    }
  }
}
