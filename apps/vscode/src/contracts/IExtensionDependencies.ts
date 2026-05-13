import * as vscode from 'vscode';
import {
  ContextEngine,
  ValidateFindingUseCase
} from '@code-review/core';

import {
  FileReviewRepository
} from '@code-review/infra';

import { VSCodeAdapter } from '../adapters/VSCodeAdapter';
import { ReviewViewProvider } from '../../src/ReviewViewProvider';

export interface IExtensionDependencies {
  context: vscode.ExtensionContext;

  vscodeAdapter: VSCodeAdapter;

  reviewRepository: FileReviewRepository;

  contextEngine: ContextEngine;

  validateFindingUseCase: ValidateFindingUseCase;

  reviewViewProvider: ReviewViewProvider;
}