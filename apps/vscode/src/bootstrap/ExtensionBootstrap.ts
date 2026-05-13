import * as vscode from 'vscode';

import { createExtensionDependencies }
    from '../dependencies/createExtensionDependencies';

import { registerCommands }
    from '../commands/registerCommands';

import { restoreCurrentBranchSession }
    from '../services/restoreCurrentBranchSession';

import { ReviewViewProvider }
    from '../views/ReviewViewProvider';

export class ExtensionBootstrap {

    constructor(
        private readonly context: vscode.ExtensionContext
    ) { }

    initialize(): void {

        const dependencies =
            createExtensionDependencies(this.context);

        this.context.subscriptions.push(
            vscode.window.registerWebviewViewProvider(
                ReviewViewProvider.viewType,
                dependencies.reviewViewProvider
            )
        );

        registerCommands(dependencies);

        void restoreCurrentBranchSession(
            dependencies.vscodeAdapter,
            dependencies.reviewRepository,
            dependencies.reviewViewProvider
        );
    }
}