import * as vscode from 'vscode';
import { VSCodeContainer } from '../dependencies/buildContainer';

let viewsRegistered = false;

export function registerViews(
  context: vscode.ExtensionContext,
  container: VSCodeContainer
): void {
  if (viewsRegistered) {
    return;
  }

  viewsRegistered = true;

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      'code-review.dashboard',
      container.dashboardProvider as any
    ),
    vscode.window.registerWebviewViewProvider(
      'code-review.findingsView',
      container.reviewPanelProvider as any
    ),
    vscode.window.registerWebviewViewProvider(
      'code-review.chatView',
      container.chatProvider as any
    ),
    vscode.window.registerWebviewViewProvider(
      'code-review.ragStatus',
      container.ragStatusProvider as any
    ),
    vscode.window.registerWebviewViewProvider(
      'code-review.dependencyGraph',
      container.dependencyGraphProvider as any
    )
  );
}