import * as vscode from 'vscode';

import { ICommand }
  from '../contracts/ICommand';

import { IExtensionDependencies }
  from '../contracts/IExtensionDependencies';

import { ClearSessionCommandHandler }
  from '../command-handlers/ClearSessionCommandHandler';

export class ClearSessionCommand
  implements ICommand {

  constructor(
    private readonly dependencies: IExtensionDependencies
  ) {}

  register(): void {

    const handler =
      new ClearSessionCommandHandler(
        this.dependencies
      );

    const disposable =
      vscode.commands.registerCommand(
        'code-review.clearSession',
        () => handler.execute()
      );

    this.dependencies.context.subscriptions.push(
      disposable
    );
  }
}