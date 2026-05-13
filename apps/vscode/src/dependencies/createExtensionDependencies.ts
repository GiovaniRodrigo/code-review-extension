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
  from '../../src/ReviewViewProvider';


/*
|--------------------------------------------------------------------------
| RAG Handlers
|--------------------------------------------------------------------------
*/

import { IndexRepositoryRagCommandHandler }
  from '../command-handlers/IndexRepositoryRagCommandHandler';

import { ClearRepositoryRagCommandHandler }
  from '../command-handlers/ClearRepositoryRagCommandHandler';

/*
|--------------------------------------------------------------------------
| RAG Services
|--------------------------------------------------------------------------
*/

import { RepositoryIndexerService }
  from '../services/rag/RepositoryIndexerService';

import { ChunkCodeService }
  from '../services/rag/ChunkCodeService';

import { BuildEmbeddingService }
  from '../services/rag/BuildEmbeddingService';

import { VectorStoreService }
  from '../services/rag/VectorStoreService';

/*
|--------------------------------------------------------------------------
| RAG Infrastructure
|--------------------------------------------------------------------------
*/

import { InMemoryVectorStore }
  from '../infrastructure/rag/vector-stores/InMemoryVectorStore';
import { OllamaEmbeddingProvider } from '../services/rag/providers/OllamaEmbeddingProvider';
import { OpenAIEmbeddingProvider } from '../services/rag/providers/OpenAIEmbeddingProvider';

export function createExtensionDependencies(
  context: vscode.ExtensionContext
): IExtensionDependencies {

  /*
  |--------------------------------------------------------------------------
  | VSCode Adapter
  |--------------------------------------------------------------------------
  */

  const vscodeAdapter =
    new VSCodeAdapter();

  /*
  |--------------------------------------------------------------------------
  | Storage
  |--------------------------------------------------------------------------
  */

  const storageDir =
    context.globalStorageUri?.fsPath
    ?? context.storageUri?.fsPath
    ?? context.extensionUri.fsPath;

  /*
  |--------------------------------------------------------------------------
  | Repository
  |--------------------------------------------------------------------------
  */

  const reviewRepository =
    new FileReviewRepository(
      storageDir
    );

  /*
  |--------------------------------------------------------------------------
  | Core
  |--------------------------------------------------------------------------
  */

  const contextEngine =
    new ContextEngine(
      reviewRepository
    );

  const validateFindingUseCase =
    new ValidateFindingUseCase(
      reviewRepository
    );

  /*
  |--------------------------------------------------------------------------
  | Views
  |--------------------------------------------------------------------------
  */

  const reviewViewProvider =
    new ReviewViewProvider(
      context.extensionUri,
      validateFindingUseCase,
      vscodeAdapter
    );

  /*
  |--------------------------------------------------------------------------
  | Embedding Provider
  |--------------------------------------------------------------------------
  */

  const provider =
    vscode.workspace
      .getConfiguration('codeReview')
      .get<string>(
        'provider',
        'mock'
      );

  const embeddingProvider =
    provider === 'openai'
      ? new OpenAIEmbeddingProvider(
        context.secrets
      )
      : new OllamaEmbeddingProvider();

  /*
  |--------------------------------------------------------------------------
  | Vector Store
  |--------------------------------------------------------------------------
  */

  const vectorStore =
    new InMemoryVectorStore();

  /*
  |--------------------------------------------------------------------------
  | RAG Services
  |--------------------------------------------------------------------------
  */

  const chunkCodeService =
    new ChunkCodeService();

  const buildEmbeddingService =
    new BuildEmbeddingService(
      embeddingProvider
    );

  const vectorStoreService =
    new VectorStoreService(
      vectorStore
    );

  const repositoryIndexerService =
    new RepositoryIndexerService(
      chunkCodeService,
      buildEmbeddingService,
      vectorStoreService
    );

  /*
  |--------------------------------------------------------------------------
  | Command Handlers
  |--------------------------------------------------------------------------
  */

  const indexRepositoryRagCommandHandler =
    new IndexRepositoryRagCommandHandler(
      repositoryIndexerService
    );

  const clearRepositoryRagCommandHandler =
    new ClearRepositoryRagCommandHandler(
      vectorStoreService
    );

  /*
  |--------------------------------------------------------------------------
  | Dependencies Container
  |--------------------------------------------------------------------------
  */
  console.log(
    '[RAG] Provider:',
    provider
  );

  console.log(
    '[RAG] Using OpenAI embeddings'
  );

  return {
    context,

    vscodeAdapter,

    reviewRepository,

    contextEngine,

    validateFindingUseCase,

    reviewViewProvider,

    indexRepositoryRagCommandHandler,

    clearRepositoryRagCommandHandler
  };
}