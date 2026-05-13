import * as vscode from 'vscode';

import { ICommand }
  from '../contracts/ICommand';

import { IExtensionDependencies }
  from '../contracts/IExtensionDependencies';

import { AnalyzeCommandHandler }
  from '../command-handlers/AnalyzeCommandHandler';

export class AnalyzeCommand
  implements ICommand {

  readonly id =
    'code-review.analyze';

  constructor(
    private readonly dependencies: IExtensionDependencies
  ) { }

  register(): void {
    const handler =
      new AnalyzeCommandHandler(
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