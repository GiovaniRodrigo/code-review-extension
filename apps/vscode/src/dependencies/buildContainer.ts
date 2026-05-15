import * as vscode from 'vscode';
import {
  AIAnalysisService,
  AnalyzeCodeWithAIUseCase,
  CodeReviewService,
  CreateCodeReviewUseCase,
  GetCodeReviewUseCase,
  RevalidateCodeReviewUseCase,
  ApproveFindingUseCase,
  DeleteCodeReviewUseCase,
  IndexRepositoryRagUseCase,
  ClearRepositoryRagUseCase,
  RagIndexingService
} from '@code-review/core';
import { 
  AIProviderFactory, 
  FileReviewRepository,
  SimpleRagContextBuilder,
  MemoryRagVectorStore,
  SimpleEmbeddingProvider,
  SimpleRagIndexer,
  TypeScriptAstBuilder 
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
  getCodeReviewUseCase: GetCodeReviewUseCase;
  revalidateCodeReviewUseCase: RevalidateCodeReviewUseCase;
  approveFindingUseCase: ApproveFindingUseCase;
  deleteCodeReviewUseCase: DeleteCodeReviewUseCase;
  indexRepositoryRagUseCase: IndexRepositoryRagUseCase;
  clearRepositoryRagUseCase: ClearRepositoryRagUseCase;
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
  
  const vectorStore = new MemoryRagVectorStore();
  const embeddingProvider = new SimpleEmbeddingProvider();
  const astBuilder = new TypeScriptAstBuilder();
  
  const ragEnabled = config.get<boolean>('rag.enabled', true);
  const contextBuilder = ragEnabled 
    ? new SimpleRagContextBuilder(vectorStore, embeddingProvider, { maxChunks: config.get<number>('rag.maxChunks', 5) })
    : undefined;

  const ragIndexer = new SimpleRagIndexer(vectorStore, embeddingProvider, astBuilder, { 
    storageDir,
    ignoredFolders: config.get<string[]>('rag.ignoredFolders', ['node_modules', '.git', 'dist', '.turbo'])
  });

  const aiProvider = AIProviderFactory.create({
    provider: config.get<'mock' | 'ollama' | 'openai' | 'gemini'>('provider', 'mock'),
    ollama: {
        baseUrl: config.get<string>('ollama.baseUrl', 'http://localhost:11434'),
        model: config.get<string>('ollama.model', 'llama3')
    },
    openai: {
        apiKey: () => context.secrets.get('openai-api-key').then(k => k || ''),
        model: config.get<string>('openai.model', 'gpt-4o-mini')
    },
    gemini: {
        apiKey: () => context.secrets.get('gemini-api-key').then(k => k || ''),
        model: config.get<string>('gemini.model', 'gemini-flash-latest')
    }
  });

  const aiAnalysisService = new AIAnalysisService(aiProvider as any, contextBuilder, {
    timeout: config.get<number>('ai.timeout', 30000),
    maxRetries: config.get<number>('ai.retries', 2)
  });

  const codeReviewService = new CodeReviewService(repository);
  const ragIndexingService = new RagIndexingService(ragIndexer);
  
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
    getCodeReviewUseCase: new GetCodeReviewUseCase(codeReviewService),
    revalidateCodeReviewUseCase: new RevalidateCodeReviewUseCase(aiAnalysisService, codeReviewService),
    approveFindingUseCase,
    deleteCodeReviewUseCase: new DeleteCodeReviewUseCase(repository),
    indexRepositoryRagUseCase: new IndexRepositoryRagUseCase(ragIndexingService),
    clearRepositoryRagUseCase: new ClearRepositoryRagUseCase(ragIndexingService),
    dashboardProvider: new DashboardProvider(),
    ragStatusProvider: new RagStatusProvider(),
    reviewPanelProvider: new ReviewPanelProvider(repository, ide, approveFindingUseCase, context)
  };
}
