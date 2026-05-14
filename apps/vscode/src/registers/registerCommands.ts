import * as vscode from 'vscode';
import { AnalyzeCodeCommandHandler } from '../command-handlers/ai/analyzeCodeCommandHandler';
import { ClearRepositoryRagCommandHandler } from '../command-handlers/rag/clearRepositoryRagCommandHandler';
import { IndexRepositoryRagCommandHandler } from '../command-handlers/rag/indexRepositoryRagCommandHandler';
import { SearchRagContextCommandHandler } from '../command-handlers/rag/searchRagContextCommandHandler';
import { SetupRagCommandHandler } from '../command-handlers/rag/setupRagCommandHandler';
import { ApproveFindingCommandHandler } from '../command-handlers/review/approveFindingCommandHandler';
import { PublishCodeReviewCommandHandler } from '../command-handlers/review/publishCodeReviewCommandHandler';
import { SyncWithVpsCommandHandler } from '../command-handlers/vps/syncWithVpsCommandHandler';
import { VSCodeContainer } from '../dependencies/buildContainer';

export function registerCommands(container: VSCodeContainer): void {
  const commands = container.commands;

  commands.register(
    'code-review.analyze',
    () => new AnalyzeCodeCommandHandler(container).handle()
  );
  commands.register(
    'code-review.setupRag',
    () => new SetupRagCommandHandler(container).handle()
  );
  commands.register(
    'code-review.indexRepositoryRag',
    () => new IndexRepositoryRagCommandHandler(container).handle()
  );
  commands.register(
    'code-review.clearRepositoryRag',
    () => new ClearRepositoryRagCommandHandler(container).handle()
  );
  commands.register(
    'code-review.searchRepositoryContext',
    () => new SearchRagContextCommandHandler(container).handle()
  );
  commands.register(
    'code-review.publishPrReview',
    () => new PublishCodeReviewCommandHandler(container).handle()
  );
  commands.register(
    'code-review.approveFinding',
    () => new ApproveFindingCommandHandler(container).handle()
  );
  commands.register(
    'code-review.syncWithVps',
    () => new SyncWithVpsCommandHandler(container).handle()
  );

  commands.register(
    'code-review.clearSession',
    async () => {
        const branch = await container.ide.getActiveBranch();
        container.reviewPanelProvider.clear(`Review session cleared for branch ${branch}.`);
    }
  );

  commands.register(
    'code-review.focus',
    () => vscode.commands.executeCommand('workbench.view.extension.code-review')
  );

  commands.register(
    'code-review.restoreSession',
    async () => {
        const branch = await container.ide.getActiveBranch();
        await container.notifications.info(`Restoring session for ${branch}`);
    }
  );

  commands.register(
    'code-review.setOpenAIApiKey',
    async () => {
        const key = await vscode.window.showInputBox({ prompt: 'Enter OpenAI API Key' });
        if (key) await container.storage.set('openai-key', key);
    }
  );
}
