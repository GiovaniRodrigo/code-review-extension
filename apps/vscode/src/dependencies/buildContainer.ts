import * as vscode from 'vscode';
import {
  AIAnalysisService,
  AnalyzeCodeWithAIUseCase,
  CodeReviewService,
  CreateCodeReviewUseCase,
  ApproveFindingUseCase,
  DeleteCodeReviewUseCase
} from '@code-review/core';
import { 
  AIProviderFactory, 
  FileReviewRepository 
} from '@code-review/infra';
import { VSCodeIdeAdapter } from '../adapters/ide/VSCodeIdeAdapter';
import { VSCodeWorkspaceAdapter } from '../adapters/ide/VSCodeWorkspaceAdapter';
import { VSCodeCommandRegistryAdapter } from '../adapters/ide/VSCodeCommandRegistryAdapter';
import { VSCodeNotificationAdapter } from '../adapters/ide/VSCodeNotificationAdapter';
import { VSCodeStorageAdapter } from '../adapters/ide/VSCodeStorageAdapter';
import { DashboardProvider } from '../providers/DashboardProvider';
import { RagStatusProvider } from '../providers/RagStatusProvider';
import { ReviewPanelProvider } from '../providers/ReviewPanelProvider';

export interface VSCodeContainer {
  context: vscode.ExtensionContext;
  ide: VSCodeIdeAdapter;
  workspace: VSCodeWorkspaceAdapter;
  commands: VSCodeCommandRegistryAdapter;
  notifications: VSCodeNotificationAdapter;
  storage: VSCodeStorageAdapter;
  analyzeCodeWithAIUseCase: AnalyzeCodeWithAIUseCase;
  createCodeReviewUseCase: CreateCodeReviewUseCase;
  approveFindingUseCase: ApproveFindingUseCase;
  deleteCodeReviewUseCase: DeleteCodeReviewUseCase;
  dashboardProvider: DashboardProvider;
  ragStatusProvider: RagStatusProvider;
  reviewPanelProvider: ReviewPanelProvider;
}

export function buildContainer(context: vscode.ExtensionContext): VSCodeContainer {
  const config = vscode.workspace.getConfiguration('codeReview');
  const storageDir =
    context.globalStorageUri?.fsPath
    ?? context.storageUri?.fsPath
    ?? context.extensionUri.fsPath;

  const repository = new FileReviewRepository(storageDir);
  
  const aiProvider = AIProviderFactory.create({
    provider: config.get<'mock' | 'ollama' | 'openai'>('provider', 'mock'),
    ollama: {
        baseUrl: config.get<string>('ollama.baseUrl', 'http://localhost:11434'),
        model: config.get<string>('ollama.model', 'llama3')
    },
    openai: {
        apiKey: context.globalState.get<string>('openai-key', ''),
        model: config.get<string>('openai.model', 'gpt-4o-mini')
    }
  });

  const aiAnalysisService = new AIAnalysisService(aiProvider as any);
  const codeReviewService = new CodeReviewService(repository);
  
  const ide = new VSCodeIdeAdapter();
  const approveFindingUseCase = new ApproveFindingUseCase(repository, ide);

  return {
    context,
    ide,
    workspace: new VSCodeWorkspaceAdapter(),
    commands: new VSCodeCommandRegistryAdapter(context),
    notifications: new VSCodeNotificationAdapter(),
    storage: new VSCodeStorageAdapter(context),
    analyzeCodeWithAIUseCase: new AnalyzeCodeWithAIUseCase(aiAnalysisService),
    createCodeReviewUseCase: new CreateCodeReviewUseCase(codeReviewService),
    approveFindingUseCase,
    deleteCodeReviewUseCase: new DeleteCodeReviewUseCase(repository),
    dashboardProvider: new DashboardProvider(),
    ragStatusProvider: new RagStatusProvider(),
    reviewPanelProvider: new ReviewPanelProvider(repository, ide, approveFindingUseCase)
  };
}
