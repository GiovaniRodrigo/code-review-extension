import * as vscode from 'vscode';
import { ReviewPanel } from './presentation/reviewPanel';
import { ReviewSidebarProvider } from './presentation/reviewSidebarProvider';
import { registerGitSessionWatcher } from './infrastructure/gitSessionWatcher';
import { buildExtensionComposition } from './infrastructure/vscodeCompositionRoot';
import { registerWebviewViewProviderOnce } from './infrastructure/vscode/safeWebviewRegistration';
import { registerCommandOnce } from './infrastructure/vscode/safeCommandRegistration';

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  const { gitService, reviewSessionService } = buildExtensionComposition(context);
  const reviewPanel = new ReviewPanel(context, reviewSessionService);

  registerGitSessionWatcher(context, {
    gitService,
    onContextChanged: async () => {
      await reviewPanel.refreshFromGitContext(false);
    }
  });

  registerWebviewViewProviderOnce(
    context,
    ReviewSidebarProvider.viewType,
    new ReviewSidebarProvider(reviewSessionService)
  );

  await registerCommandOnce(context, 'giovaniCodeReview.openDashboard', () => reviewPanel.open('dashboard'));
  await registerCommandOnce(context, 'giovaniCodeReview.syncRemote', async () => {
    const syncedPath = await reviewSessionService.syncRemote();
    vscode.window.showInformationMessage(`Sincronizacao premium de Code Review concluida em: ${syncedPath}`);
  });
}

export function deactivate(): void {}
