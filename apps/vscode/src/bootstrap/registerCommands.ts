import * as vscode from 'vscode';
import { VSCodeContainer } from '../dependencies/buildContainer';
import { AIProviderFactory } from '@code-review/infra';

import { analyzeCommand } from '../commands/analyzeCommand';
import { analyzeWorkspaceCommand } from '../commands/analyzeWorkspaceCommand';
import { generatePRSummaryCommand } from '../commands/generatePRSummaryCommand';
import { generateQualityReportCommand } from '../commands/generateQualityReportCommand';
import { clearSessionCommand } from '../commands/clearSessionCommand';
import { focusCommand } from '../commands/focusCommand';
import { restoreSessionCommand } from '../commands/restoreSessionCommand';
import { publishPrReviewCommand } from '../commands/publishPrReviewCommand';

export function registerCommands(context: vscode.ExtensionContext, container: VSCodeContainer): void {
  const commandsToRegister = [
    analyzeCommand,
    analyzeWorkspaceCommand,
    generatePRSummaryCommand,
    generateQualityReportCommand,
    clearSessionCommand,
    focusCommand,
    restoreSessionCommand,
    publishPrReviewCommand
  ];

  for (const cmd of commandsToRegister) {
    container.commands.register(cmd.id, () => cmd.execute(container));
  }

  container.commands.register('code-review.setOpenAIApiKey', async () => {
    const key = await vscode.window.showInputBox({ 
        prompt: 'Enter OpenAI API Key',
        password: true 
    });
    if (key) {
        await context.secrets.store('openai-api-key', key);
        await container.notifications.info('OpenAI API Key stored securely.');
    }
  });

  container.commands.register('code-review.setGeminiApiKey', async () => {
    const key = await vscode.window.showInputBox({ 
        prompt: 'Enter Gemini API Key',
        password: true 
    });
    if (key) {
        await context.secrets.store('gemini-api-key', key);
        await container.notifications.info('Gemini API Key stored securely.');
    }
  });

  container.commands.register('code-review.setGitHubToken', async () => {
    const token = await vscode.window.showInputBox({ 
        prompt: 'Enter GitHub Personal Access Token',
        password: true 
    });
    if (token) {
        await context.secrets.store('github-token', token);
        await container.notifications.info('GitHub token stored securely.');
    }
  });

  container.commands.register('code-review.setGitLabToken', async () => {
    const token = await vscode.window.showInputBox({ 
        prompt: 'Enter GitLab Private Token',
        password: true 
    });
    if (token) {
        await context.secrets.store('gitlab-token', token);
        await container.notifications.info('GitLab token stored securely.');
    }
  });
  
  container.commands.register('code-review.approveFinding', async (sessionId: any, findingId: any) => {
    try {
      await container.approveFindingUseCase.execute(sessionId, findingId);
      await container.reviewPanelProvider.refresh();
      await container.dashboardProvider.refresh();
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

  container.commands.register('code-review.setProvider', async () => {
    try {
      const { getAIProviderConfigs } = await import('../dependencies/buildContainer');
      const providers = await getAIProviderConfigs(context);
      const config = vscode.workspace.getConfiguration('codeReview');

      if (providers.length === 0) {
        await container.notifications.warning('No AI providers configured in settings.');
        return;
      }

      await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Checking AI Providers health...',
        cancellable: false
      }, async () => {
        const results = await container.discoverAIProvidersUseCase.execute(
            providers,
            (pc) => AIProviderFactory.create(pc) as any
        );

        const available = results.filter(r => r.status.status === 'available');

        if (available.length === 0) {
            const firstError = results.find(r => r.status.status !== 'available');
            throw new Error(`No providers available. First error: ${firstError?.status.message || 'Unknown'}`);
        }

        if (available.length === 1) {
            const selected = available[0];
            await config.update('ai.activeProviderId', selected.config.id, vscode.ConfigurationTarget.Global);
            container.aiProviderRegistry.setActiveProvider(selected.config.id);
            await container.notifications.info(`AI Provider "${selected.config.label}" selected automatically.`);
            return;
        }

        const items = available.map(r => ({
            label: r.config.label,
            description: r.config.model,
            detail: r.config.type,
            id: r.config.id
        }));

        const picked = await vscode.window.showQuickPick(items, {
            placeHolder: 'Select an AI Provider'
        });

        if (picked && typeof picked === 'object') {
            const pickedItem = picked as any;
            await config.update('ai.activeProviderId', pickedItem.id, vscode.ConfigurationTarget.Global);
            container.aiProviderRegistry.setActiveProvider(pickedItem.id);
            await container.notifications.info(`AI Provider "${pickedItem.label}" selected.`);
        }
      });
    } catch (e: any) {
      await container.notifications.error(`Failed to discover providers: ${e.message}`);
    }
  });

  container.commands.register('code-review.syncWithVps', async () => {
    try {
      const branch = await container.ide.getActiveBranch();
      await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: `Syncing review session for ${branch}...`,
        cancellable: false
      }, async () => {
        await container.syncWithVpsUseCase.execute(branch);
      });
      await container.reviewPanelProvider.refresh();
      await container.dashboardProvider.refresh();
      await container.notifications.info('Sync completed successfully.');
    } catch (e: any) {
      await container.notifications.error(`Sync failed: ${e.message}`);
    }
  });

  // Stubs for remaining commands required by package.json
  const dummyCommands = [
    'code-review.analyzeBranchCommits',
    'code-review.analyzePr',
    'code-review.searchRepositoryContext',
    'code-review.setGitLabCredentials',
    'code-review.setGitLabUrl',
    'code-review.syncRemotePR',
    'code-review.setupRag'
  ];

  for (const cmd of dummyCommands) {
    container.commands.register(cmd, async () => {
      await container.notifications.info(`Command ${cmd} is not fully implemented yet.`);
    });
  }
}
