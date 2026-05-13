import * as vscode from 'vscode';

import {
  ContextEngine,
  ValidateFindingUseCase
} from '@code-review/core';

import {
  FileReviewRepository
} from '@code-review/infra';

import { VSCodeAdapter } from '../adapters/VSCodeAdapter';
import { ReviewViewProvider } from '../views/ReviewViewProvider';

import { IndexRepositoryRagCommandHandler } from '../command-handlers/IndexRepositoryRagCommandHandler';
import { ClearRepositoryRagCommandHandler }
  from '../command-handlers/ClearRepositoryRagCommandHandler';
import { SearchContextService } from '../services/rag/SearchContextService';


export interface IExtensionDependencies {
  context: vscode.ExtensionContext;

  vscodeAdapter: VSCodeAdapter;

  reviewRepository: FileReviewRepository;

  contextEngine: ContextEngine;

  validateFindingUseCase: ValidateFindingUseCase;

  reviewViewProvider: ReviewViewProvider;

  indexRepositoryRagCommandHandler: IndexRepositoryRagCommandHandler;
  clearRepositoryRagCommandHandler: ClearRepositoryRagCommandHandler;
  searchContextService: SearchContextService;
}