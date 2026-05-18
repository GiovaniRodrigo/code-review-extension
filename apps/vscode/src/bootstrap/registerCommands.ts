import * as vscode from 'vscode';
import { VSCodeContainer } from '../dependencies/buildContainer';
import { registerProductCommandSuite } from '../product/ProductCommandSuite';

export function registerCommands(context: vscode.ExtensionContext, container: VSCodeContainer): void {
  registerProductCommandSuite(context, container);

  // Product entrypoint
  container.commands.register('code-review.startReview', async () => {
    await vscode.commands.executeCommand('code-review.openWorkspace');
    await vscode.commands.executeCommand('workbench.view.extension.code-review');
  });

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
  container.commands.register('code-review.setupRag', async () => {
    const action = await vscode.window.showQuickPick([
      { label: '$(database) Index Repository RAG', command: 'code-review.indexRepositoryRag' },
      { label: '$(trash) Clear Repository RAG', command: 'code-review.clearRepositoryRag' },
      { label: '$(search) Search Repository Context', command: 'code-review.searchRepositoryContext' },
      { label: '$(settings-gear) Open RAG Settings', command: 'workbench.action.openSettings', args: ['codeReview.rag'] }
    ], { placeHolder: 'RAG Management' });

    if (!action) return;
    await vscode.commands.executeCommand(action.command, ...(action.args || []));
  });
  
  // Configuration Commands
  container.commands.register('code-review.setProvider', () => container.setProviderCommandHandler.execute());
  container.commands.register('code-review.setOpenAIApiKey', () => container.setOpenAIApiKeyCommandHandler.execute());
  container.commands.register('code-review.setGeminiApiKey', () => container.setGeminiApiKeyCommandHandler.execute());
  container.commands.register('code-review.setup', () => container.setupCommandHandler.execute());
  container.commands.register('code-review.runDiagnostics', () => container.runDiagnosticsCommandHandler.execute());
  container.commands.register('code-review.exportMarkdown', () => container.exportMarkdownCommandHandler.execute());
  container.commands.register('code-review.setupOllama', () => container.setupOllamaCommandHandler.execute());
  container.commands.register('code-review.revalidateSession', () => container.revalidateSessionCommandHandler.execute());
  container.commands.register('code-review.configureCloudProvider', () => container.configureCloudProviderCommandHandler.execute());
  container.commands.register('code-review.testAIProvider', () => container.testAIProviderCommandHandler.execute());
  container.commands.register('code-review.exportPdf', () => container.exportPdfCommandHandler.execute());
  container.commands.register('code-review.selectReviewTemplate', () => container.selectReviewTemplateCommandHandler.execute());
  container.commands.register('code-review.showProUpgrade', () => container.showProUpgradeCommandHandler.execute());
  container.commands.register('code-review.openReviewHistory', () => container.openReviewHistoryCommandHandler.execute());
  
  // Internal/Sync Commands
  container.commands.register('code-review.chat.refresh', () => container.chatProvider.refresh());
  
  // Sync Commands
  container.commands.register('code-review.publishPrReview', () => container.publishPrReviewCommandHandler.execute());
  container.commands.register('code-review.syncWithVps', () => container.syncWithVpsCommandHandler.execute());

  // Navigation Commands
  container.commands.register('code-review.focus', async (args: any) => {
    if (args?.finding) {
        return container.ide.focusFinding(args.finding);
    }
    await vscode.commands.executeCommand('workbench.view.extension.code-review');
    return vscode.commands.executeCommand('code-review.openDashboard');
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
