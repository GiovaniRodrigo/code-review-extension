import * as vscode from 'vscode';

import { ICommand }
  from '../contracts/ICommand';

import { IExtensionDependencies }
  from '../contracts/IExtensionDependencies';

import { ClearSessionCommandHandler }
  from '../command-handlers/ClearSessionCommandHandler';

export class ClearSessionCommand
  implements ICommand {

  readonly id =
    'code-review.clearSession';

  constructor(
    private readonly dependencies: IExtensionDependencies
  ) { }

  register(): void {

    const handler =
      new ClearSessionCommandHandler(
        this.dependencies
      );

    const disposable =
      vscode.commands.registerCommand(
        this.id,
        () => handler.execute()
      );

    this.dependencies.context.subscriptions.push(
      disposable
    );
  }
}