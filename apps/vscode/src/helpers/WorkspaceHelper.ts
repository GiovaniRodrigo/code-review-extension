import * as vscode from 'vscode';

export class WorkspaceHelper {

    static getWorkspacePath(): string {

        const workspacePath =
            vscode.workspace
                .workspaceFolders?.[0]
                ?.uri.fsPath;

        if (!workspacePath) {
            throw new Error(
                'No workspace folder opened.'
            );
        }

        return workspacePath;
    }
}