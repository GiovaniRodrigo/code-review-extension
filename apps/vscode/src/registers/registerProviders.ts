import * as vscode from 'vscode';
import { VSCodeContainer } from '../dependencies/buildContainer';

export function registerProviders(
  context: vscode.ExtensionContext,
  container: VSCodeContainer
): void {
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      'code-review.dashboard',
      container.dashboardProvider
    ),
    vscode.window.registerWebviewViewProvider(
      'code-review.ragStatus',
      container.ragStatusProvider
    ),
    vscode.window.registerWebviewViewProvider(
      'code-review.reviewPanel',
      container.reviewPanelProvider
    )
  );
}
