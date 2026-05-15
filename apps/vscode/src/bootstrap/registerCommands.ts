import * as vscode from 'vscode';
import { VSCodeContainer } from '../dependencies/buildContainer';

import { analyzeCommand } from '../commands/analyzeCommand';
import { clearSessionCommand } from '../commands/clearSessionCommand';
import { focusCommand } from '../commands/focusCommand';
import { restoreSessionCommand } from '../commands/restoreSessionCommand';

export function registerCommands(context: vscode.ExtensionContext, container: VSCodeContainer): void {
  const commandsToRegister = [
    analyzeCommand,
    clearSessionCommand,
    focusCommand,
    restoreSessionCommand
  ];

  for (const cmd of commandsToRegister) {
    container.commands.register(cmd.id, () => cmd.execute(container));
  }

  container.commands.register('code-review.setOpenAIApiKey', async () => {
    const key = await vscode.window.showInputBox({ prompt: 'Enter OpenAI API Key' });
    if (key) await container.storage.set('openai-key', key);
  });
  
  container.commands.register('code-review.approveFinding', async (sessionId: string, findingId: string) => {
    try {
      await container.approveFindingUseCase.execute(sessionId, findingId);
      await container.reviewPanelProvider.refresh();
      await container.notifications.info('Finding approved and diagnostics updated.');
    } catch (e: any) {
      await container.notifications.error(`Failed to approve: ${e.message}`);
    }
  });

  container.commands.register('code-review.indexRepositoryRag', async () => {
    try {
      const workspacePath = container.workspace.getWorkspacePath();
      if (!workspacePath) throw new Error('No workspace folder opened.');
      
      await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Indexing repository for RAG...',
        cancellable: false
      }, async () => {
        await container.indexRepositoryRagUseCase.execute(workspacePath);
      });
      
      await container.notifications.info('Repository indexed successfully.');
    } catch (e: any) {
      await container.notifications.error(`Failed to index: ${e.message}`);
    }
  });

  container.commands.register('code-review.clearRepositoryRag', async () => {
    try {
      await container.clearRepositoryRagUseCase.execute();
      await container.notifications.info('RAG index cleared.');
    } catch (e: any) {
      await container.notifications.error(`Failed to clear RAG: ${e.message}`);
    }
  });

  // Stubs for remaining commands required by package.json
  const dummyCommands = [
    'code-review.analyzeBranchCommits',
    'code-review.analyzePr',
    'code-review.publishPrReview',
    'code-review.searchRepositoryContext',
    'code-review.setGitLabCredentials',
    'code-review.setGitLabToken',
    'code-review.setGitLabUrl',
    'code-review.setProvider',
    'code-review.syncRemotePR',
    'code-review.setupRag',
    'code-review.syncWithVps'
  ];

  for (const cmd of dummyCommands) {
    container.commands.register(cmd, async () => {
      await container.notifications.info(`Command ${cmd} is not fully implemented yet.`);
    });
  }
}
