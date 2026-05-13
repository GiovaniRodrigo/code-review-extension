import * as vscode from 'vscode';

export class UIHelper {
    /**
     * Exibe um input box com ignoreFocusOut: true por padrão.
     */
    static async showInputBox(
        options: vscode.InputBoxOptions
    ): Promise<string | undefined> {
        return vscode.window.showInputBox({
            ...options,
            ignoreFocusOut: true
        });
    }

    /**
     * Exibe um quick pick com ignoreFocusOut: true por padrão.
     */
    static async showQuickPick<T extends vscode.QuickPickItem>(
        items: T[] | Promise<T[]>,
        options?: vscode.QuickPickOptions,
        token?: vscode.CancellationToken
    ): Promise<T | undefined> {
        return vscode.window.showQuickPick(items, {
            ...options,
            ignoreFocusOut: true
        }, token);
    }
}
