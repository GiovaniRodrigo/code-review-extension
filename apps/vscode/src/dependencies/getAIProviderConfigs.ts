import * as vscode from 'vscode';

export async function getAIProviderConfigs(
  _context: vscode.ExtensionContext
): Promise<any[]> {
  const config = vscode.workspace.getConfiguration('codeReview');
  return config.get<any[]>('ai.providers', []);
}
