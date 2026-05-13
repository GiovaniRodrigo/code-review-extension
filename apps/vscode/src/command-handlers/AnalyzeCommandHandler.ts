import * as vscode from 'vscode';

import { AnalyzeCodeUseCase }
  from '@code-review/core';

import { ICommandHandler }
  from '../contracts/ICommandHandler';

import { IExtensionDependencies }
  from '../contracts/IExtensionDependencies';

import { AIReviewService }
  from '../services/AIReviewService';

export class AnalyzeCommandHandler
  implements ICommandHandler {

  private readonly aiReviewService = new AIReviewService();

  constructor(
    private readonly dependencies:
      IExtensionDependencies
  ) { }

  async execute(): Promise<void> {

    const {
      context,
      vscodeAdapter,
      reviewRepository,
      contextEngine,
      reviewViewProvider
    } = this.dependencies;

    reviewViewProvider.setLoading();

    try {

      const aiProvider =
        await this.aiReviewService.createProvider(context);

      const useCase =
        new AnalyzeCodeUseCase(
          aiProvider,
          vscodeAdapter,
          reviewRepository,
          contextEngine
        );

      const session =
        await useCase.execute();

      reviewViewProvider.updateFindings(
        session.id,
        session.findings
      );

      vscode.window.showInformationMessage(
        `Review completed: ${session.findings.length} findings found.`
      );

    } catch (error: any) {

      const message =
        `Error analyzing code: ${error.message}`;

      reviewViewProvider.setError(message);

      vscode.window.showErrorMessage(message);
    }
  }
}