import * as vscode from 'vscode';
import { ICommand } from '../contracts/ICommand';
import { IExtensionDependencies } from '../contracts/IExtensionDependencies';
import { PublishPrReviewCommandHandler } from '../command-handlers/PublishPrReviewCommandHandler';

export class PublishPrReviewCommand implements ICommand {
    readonly id = 'code-review.publishPrReview';

    constructor(
        private readonly dependencies: IExtensionDependencies
    ) { }

    register(context: vscode.ExtensionContext): void {
        const handler = new PublishPrReviewCommandHandler(this.dependencies);

        const disposable = vscode.commands.registerCommand(
            this.id,
            () => handler.execute()
        );

        context.subscriptions.push(disposable);
    }
}
