import * as vscode from 'vscode';
import { VSCodeContainer } from '../dependencies/buildContainer';
import { restoreCurrentBranchSession } from './restoreCurrentBranchSession';

export function registerEvents(context: vscode.ExtensionContext, container: VSCodeContainer): void {
  container.ide.onBranchChange(async (branch) => {
    const config = vscode.workspace.getConfiguration('codeReview');
    if (config.get<boolean>('autoRestoreSession', true)) {
        console.log(`[EVENTS] Branch changed to: ${branch}. Restoring session...`);
        await restoreCurrentBranchSession(context, container);
    }
  });

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(async (event) => {
      if (event.affectsConfiguration('codeReview')) {
        console.log('[EVENTS] Configuration changed. Updating container...');
        const { getAIProviderConfigs } = await import('../dependencies/buildContainer');
        const { AIProviderFactory } = await import('@code-review/infra');
        
        const providers = await getAIProviderConfigs(context);
        const activeProviderId = vscode.workspace.getConfiguration('codeReview').get<string>('ai.activeProviderId');

        // Re-register all providers
        const isE2E = process.env.CODE_REVIEW_E2E === 'true' || context.extensionMode === vscode.ExtensionMode.Test;

        providers.forEach(pc => {
            if (isE2E) {
                const { MockAIProvider, GeminiMockProvider } = require('@code-review/infra');
                if (pc.type === 'gemini') {
                    container.aiProviderRegistry.register(pc.id, new GeminiMockProvider() as any);
                } else {
                    container.aiProviderRegistry.register(pc.id, new MockAIProvider() as any);
                }
            } else {
                // Re-bind secrets
                if (pc.type === 'openai' && !pc.apiKey) {
                    pc.apiKey = async () => (context.secrets?.get ? (await context.secrets.get('openai-api-key')) : '') || '';
                } else if (pc.type === 'gemini' && !pc.apiKey) {
                    pc.apiKey = async () => (context.secrets?.get ? (await context.secrets.get('gemini-api-key')) : '') || '';
                }
                container.aiProviderRegistry.register(pc.id, AIProviderFactory.create(pc) as any);
            }
        });

        if (activeProviderId) {
            container.aiProviderRegistry.setActiveProvider(activeProviderId);
        }
      }
    }),
    vscode.workspace.onDidSaveTextDocument(async (document) => {
      const config = vscode.workspace.getConfiguration('codeReview');
      if (config.get<boolean>('autoRevalidate', false)) {
        // Only revalidate if it's a code file
        if (['typescript', 'javascript', 'python'].includes(document.languageId)) {
            console.log(`[EVENTS] File saved: ${document.fileName}. Triggering revalidation...`);
            await vscode.commands.executeCommand('code-review.analyze');
        }
      }
    })
  );
}
