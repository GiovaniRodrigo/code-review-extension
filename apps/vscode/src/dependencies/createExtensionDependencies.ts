import * as vscode from 'vscode';

import {
  ContextEngine,
  ValidateFindingUseCase
} from '@code-review/core';

import {
  FileReviewRepository
} from '@code-review/infra';

import { IExtensionDependencies }
  from '../contracts/IExtensionDependencies';

import { VSCodeAdapter }
  from '../adapters/VSCodeAdapter';

import { ReviewViewProvider }
  from '../views/ReviewViewProvider';

export function createExtensionDependencies(
  context: vscode.ExtensionContext
): IExtensionDependencies {

  const vscodeAdapter =
    new VSCodeAdapter();

  const storageDir =
    context.globalStorageUri?.fsPath
    ?? context.storageUri?.fsPath
    ?? context.extensionUri.fsPath;

  const reviewRepository =
    new FileReviewRepository(storageDir);

  const contextEngine =
    new ContextEngine();

  const validateFindingUseCase =
    new ValidateFindingUseCase(
      reviewRepository
    );

  const reviewViewProvider =
    new ReviewViewProvider(
      context.extensionUri,
      validateFindingUseCase,
      vscodeAdapter
    );

  return {
    context,
    vscodeAdapter,
    reviewRepository,
    contextEngine,
    validateFindingUseCase,
    reviewViewProvider
  };
}
