import * as vscode from 'vscode';

const registeredViews = new Set<string>();

export function registerWebviewViewProviderOnce(
  context: vscode.ExtensionContext,
  viewId: string,
  provider: vscode.WebviewViewProvider
): void {
  if (registeredViews.has(viewId)) {
    console.warn(`[Code Review] View provider already registered in this extension host: ${viewId}`);
    return;
  }

  try {
    const disposable = vscode.window.registerWebviewViewProvider(viewId, provider);
    registeredViews.add(viewId);
    context.subscriptions.push({
      dispose: () => {
        registeredViews.delete(viewId);
        disposable.dispose();
      }
    });
  } catch (error) {
    if (isDuplicateViewRegistrationError(error, viewId)) {
      registeredViews.add(viewId);
      console.warn(`[Code Review] Ignoring duplicated VS Code view provider registration for ${viewId}.`);
      return;
    }

    throw error;
  }
}

function isDuplicateViewRegistrationError(error: unknown, viewId: string): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return message.includes('already registered') || message.includes(`Cannot register multiple views with same id \`${viewId}\``);
}
