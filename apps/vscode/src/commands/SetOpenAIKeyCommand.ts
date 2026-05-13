import * as vscode from 'vscode';

import { ICommand }
  from '../contracts/ICommand';

import { IExtensionDependencies }
  from '../contracts/IExtensionDependencies';

import { SetOpenAIKeyCommandHandler }
  from '../command-handlers/SetOpenAIKeyCommandHandler';

export class SetOpenAIKeyCommand
  implements ICommand {

  constructor(
    private readonly dependencies: IExtensionDependencies
  ) {}

  register(): void {

    const handler =
      new SetOpenAIKeyCommandHandler(
        this.dependencies
      );

    const disposable =
      vscode.commands.registerCommand(
        'code-review.setOpenAIApiKey',
        () => handler.execute()
      );

    this.dependencies.context.subscriptions.push(
      disposable
    );
  }
}