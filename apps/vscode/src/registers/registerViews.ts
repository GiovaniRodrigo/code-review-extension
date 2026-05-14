import * as vscode from 'vscode';
import { VSCodeContainer } from '../dependencies/buildContainer';

export function registerViews(
  context: vscode.ExtensionContext,
  container: VSCodeContainer
): void {
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      'code-review.dashboard',
      container.dashboardProvider
    )
  );

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      'code-review.findingsView',
      container.reviewPanelProvider
    )
  );
}
