import * as vscode from 'vscode';
import { ICommand } from '../contracts/ICommand';
import { IExtensionDependencies } from '../contracts/IExtensionDependencies';

export class FocusCommand implements ICommand {
    readonly id = 'code-review.focus';

    constructor(
        private readonly _dependencies: IExtensionDependencies
    ) { }

    register(context: vscode.ExtensionContext): void {
        const disposable = vscode.commands.registerCommand(
            this.id,
            () => {
                vscode.commands.executeCommand('code-review.findingsView.focus');
            }
        );

        context.subscriptions.push(disposable);
    }
}
