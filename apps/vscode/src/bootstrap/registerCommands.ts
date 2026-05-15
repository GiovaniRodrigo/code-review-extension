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

  // Stubs for remaining commands required by package.json
  const dummyCommands = [
    'code-review.analyzeBranchCommits',
    'code-review.analyzePr',
    'code-review.clearRepositoryRag',
    'code-review.indexRepositoryRag',
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
