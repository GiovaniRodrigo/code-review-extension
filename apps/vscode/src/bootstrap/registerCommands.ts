import * as vscode from 'vscode';
import { VSCodeContainer } from '../dependencies/buildContainer';

export function registerCommands(context: vscode.ExtensionContext, container: VSCodeContainer): void {
  // AI Analysis Commands
  container.commands.register('code-review.analyze', (args?: any) => container.analyzeCommandHandler.execute(args));
  container.commands.register('code-review.analyzeWorkspace', () => container.analyzeWorkspaceCommandHandler.execute());
  container.commands.register('code-review.analyzeBranchCommits', (baseBranch?: any) => container.analyzeBranchCommitsCommandHandler.execute(baseBranch));
  container.commands.register('code-review.analyzePr', (prNumber?: any) => container.analyzePrCommandHandler.execute(prNumber));
  
  // Report Commands
  container.commands.register('code-review.generatePRSummary', () => container.generatePRSummaryCommandHandler.execute());
  container.commands.register('code-review.generateQualityReport', () => container.generateQualityReportCommandHandler.execute());
  
  // Session Commands
  container.commands.register('code-review.clearSession', () => container.clearSessionCommandHandler.execute());
  container.commands.register('code-review.restoreSession', () => container.restoreSessionCommandHandler.execute());
  
  // Finding Commands
  container.commands.register('code-review.approveFinding', (sessionId: any, findingId: any) => container.approveFindingCommandHandler.execute(sessionId, findingId));
  
  // RAG Commands
  container.commands.register('code-review.indexRepositoryRag', () => container.indexRepositoryRagCommandHandler.execute());
  container.commands.register('code-review.clearRepositoryRag', () => container.clearRepositoryRagCommandHandler.execute());
  container.commands.register('code-review.searchRepositoryContext', () => container.searchRepositoryContextCommandHandler.execute());
  container.commands.register('code-review.setupRag', () => vscode.commands.executeCommand('code-review.setup'));
  
  // Configuration Commands
  container.commands.register('code-review.setProvider', () => container.setProviderCommandHandler.execute());
  container.commands.register('code-review.setOpenAIApiKey', () => container.setOpenAIApiKeyCommandHandler.execute());
  container.commands.register('code-review.setGeminiApiKey', () => container.setGeminiApiKeyCommandHandler.execute());
  container.commands.register('code-review.setup', () => container.setupCommandHandler.execute());
  
  // Sync Commands
  container.commands.register('code-review.publishPrReview', () => container.publishPrReviewCommandHandler.execute());
  container.commands.register('code-review.syncWithVps', () => container.syncWithVpsCommandHandler.execute());

  // Navigation Commands
  container.commands.register('code-review.focus', (args: any) => {
    if (args?.finding) {
        return container.ide.focusFinding(args.finding);
    }
    return vscode.commands.executeCommand('code-review.dashboard.focus');
  });

  // Tokens (legacy implementation being kept for simplicity until next refactor)
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

  // Stubs for remaining commands required by package.json
  const dummyCommands = [
    'code-review.setGitLabCredentials',
    'code-review.setGitLabUrl',
    'code-review.syncRemotePR'
  ];

  for (const cmd of dummyCommands) {
    container.commands.register(cmd, async () => {
      await container.notifications.info(`Command ${cmd} is not fully implemented yet.`);
    });
  }
}
