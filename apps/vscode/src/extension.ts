import * as vscode from 'vscode';
import { AnalyzeCodeUseCase, ValidateFindingUseCase } from '@code-review/core';
import { AIProvider, FileReviewRepository, MockAIProvider, OllamaProvider, OpenAIProvider } from '@code-review/infra';
import { VSCodeAdapter } from './VSCodeAdapter';
import { ReviewViewProvider } from './ReviewViewProvider';

export function activate(context: vscode.ExtensionContext) {
  const adapter = new VSCodeAdapter();
  const repository = new FileReviewRepository(context.globalStorageUri.fsPath);
  const validateUseCase = new ValidateFindingUseCase(repository, adapter);
  
  const provider = new ReviewViewProvider(context.extensionUri, validateUseCase, adapter);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(ReviewViewProvider.viewType, provider)
  );

  void restoreCurrentBranchSession(adapter, repository, provider);

  const disposable = vscode.commands.registerCommand('code-review.analyze', async () => {
    provider.setLoading();

    try {
      const aiProvider = await createAIProvider(context);
      const useCase = new AnalyzeCodeUseCase(aiProvider, adapter, repository);
      const session = await useCase.execute();
      provider.updateFindings(session.id, session.findings);
      vscode.window.showInformationMessage(`Review completed: ${session.findings.length} findings found.`);
    } catch (error: any) {
      const message = `Error analyzing code: ${error.message}`;
      provider.setError(message);
      vscode.window.showErrorMessage(message);
    }
  });

  const clearDisposable = vscode.commands.registerCommand('code-review.clearSession', async () => {
    const sessionId = provider.getCurrentSessionId();

    if (sessionId) {
      await repository.deleteSession(sessionId);
    }

    provider.clear('Review session cleared.');
    vscode.window.showInformationMessage('Review session cleared.');
  });

  const setOpenAIKeyDisposable = vscode.commands.registerCommand('code-review.setOpenAIApiKey', async () => {
    const apiKey = await vscode.window.showInputBox({
      prompt: 'Enter your OpenAI API key',
      password: true,
      ignoreFocusOut: true
    });

    if (!apiKey) {
      return;
    }

    await context.secrets.store('codeReview.openai.apiKey', apiKey);
    vscode.window.showInformationMessage('OpenAI API key saved securely.');
  });

  context.subscriptions.push(disposable, clearDisposable, setOpenAIKeyDisposable);
}

export function deactivate() {}

async function createAIProvider(context: vscode.ExtensionContext): Promise<AIProvider> {
  const config = vscode.workspace.getConfiguration('codeReview');
  const provider = config.get<string>('provider', 'mock');

  if (provider === 'ollama') {
    const baseUrl = config.get<string>('ollama.baseUrl', 'http://localhost:11434');
    const model = config.get<string>('ollama.model', 'llama3');

    return new OllamaProvider(baseUrl, model, {
      post: async (url: string, data: any) => {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          throw new Error(`Ollama responded with ${response.status}`);
        }

        return { data: await response.json() };
      }
    });
  }

  if (provider === 'openai') {
    const apiKey = await context.secrets.get('codeReview.openai.apiKey');
    const model = config.get<string>('openai.model', 'gpt-4o-mini');

    if (!apiKey) {
      throw new Error('OpenAI provider selected, but no API key is saved. Run "Set OpenAI API Key" first.');
    }

    return new OpenAIProvider(apiKey, {
      post: async (url: string, data: any, requestConfig: any) => {
        const response = await fetch(url, {
          method: 'POST',
          headers: requestConfig.headers,
          body: JSON.stringify({
            ...data,
            model
          })
        });

        if (!response.ok) {
          throw new Error(`OpenAI responded with ${response.status}`);
        }

        return { data: await response.json() };
      }
    });
  }

  return new MockAIProvider();
}

async function restoreCurrentBranchSession(
  adapter: VSCodeAdapter,
  repository: FileReviewRepository,
  provider: ReviewViewProvider
) {
  try {
    const branch = await adapter.getActiveBranch();
    const session = await repository.getSessionByBranch(branch);

    if (session) {
      provider.updateFindings(session.id, session.findings);
    } else {
      provider.clear(`No review session found for branch ${branch}.`);
    }
  } catch (error: any) {
    provider.setError(`Could not restore review session: ${error.message}`);
    vscode.window.showWarningMessage(`Could not restore review session: ${error.message}`);
  }
}
