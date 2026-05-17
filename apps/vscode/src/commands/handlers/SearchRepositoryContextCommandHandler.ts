import * as vscode from 'vscode';
import type { CommandHandlerPort } from '@code-review/core';
import type { VSCodeContainerPort } from '../../dependencies/types/VSCodeContainerPort';

export class SearchRepositoryContextCommandHandler implements CommandHandlerPort {
  constructor(private container: VSCodeContainerPort) {}

  async execute(): Promise<void> {
    try {
        const query = await vscode.window.showInputBox({
            prompt: 'Enter search query for repository context',
            placeHolder: 'e.g. How are service registrations handled?'
        });

        if (!query) return;

        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Searching context for: "${query}"...`
        }, async () => {
            const results = await this.container.searchRagContextUseCase.execute(query);
            
            if (results.length === 0) {
                const index = await vscode.window.showInformationMessage('No relevant context found. Index repository?', 'Yes', 'No');
                if (index === 'Yes') {
                    await vscode.commands.executeCommand('code-review.indexRepositoryRag');
                }
                return;
            }

            const selection = await vscode.window.showQuickPick<{ label: string, detail: string, description: string, filePath: string }>(
                results.map(r => ({
                    label: r.source.split('/').pop() || r.source,
                    detail: r.content.substring(0, 100).replace(/\n/g, ' '),
                    description: `Score: ${Math.round((r.score || 0) * 100)}%`,
                    filePath: r.source
                })),
                { placeHolder: 'Select a result to open the file' }
            );

            if (selection) {
                const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(selection.filePath));
                await vscode.window.showTextDocument(doc);
            }
        });
    } catch (e: any) {
        await this.container.notifications.error(`Search error: ${e.message}`);
    }
  }
}
