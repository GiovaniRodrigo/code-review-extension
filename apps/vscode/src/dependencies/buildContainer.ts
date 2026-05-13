import * as vscode from 'vscode';
import {
  AIAnalysisService,
  AnalyzeCodeWithAIUseCase,
  CodeReviewService,
  CreateCodeReviewUseCase
} from '@code-review/core';
import { CloudAIProvider, FileReviewRepository } from '@code-review/infra';
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
  dashboardProvider: DashboardProvider;
  ragStatusProvider: RagStatusProvider;
  reviewPanelProvider: ReviewPanelProvider;
}

export function buildContainer(context: vscode.ExtensionContext): VSCodeContainer {
  const storageDir =
    context.globalStorageUri?.fsPath
    ?? context.storageUri?.fsPath
    ?? context.extensionUri.fsPath;

  const repository = new FileReviewRepository(storageDir);
  const aiProvider = new CloudAIProvider();
  const aiAnalysisService = new AIAnalysisService(aiProvider);
  const codeReviewService = new CodeReviewService(repository);

  return {
    context,
    ide: new VSCodeIdeAdapter(),
    workspace: new VSCodeWorkspaceAdapter(),
    commands: new VSCodeCommandRegistryAdapter(context),
    notifications: new VSCodeNotificationAdapter(),
    storage: new VSCodeStorageAdapter(context),
    analyzeCodeWithAIUseCase: new AnalyzeCodeWithAIUseCase(aiAnalysisService),
    createCodeReviewUseCase: new CreateCodeReviewUseCase(codeReviewService),
    dashboardProvider: new DashboardProvider(),
    ragStatusProvider: new RagStatusProvider(),
    reviewPanelProvider: new ReviewPanelProvider()
  };
}
