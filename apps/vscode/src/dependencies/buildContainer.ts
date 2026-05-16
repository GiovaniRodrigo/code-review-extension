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
  RagIndexingService,
  AIProviderRegistry,
  AIProviderDiscoveryService,
  DiscoverAIProvidersUseCase,
  SelectAIProviderUseCase,
  AIProviderConfig
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
  discoverAIProvidersUseCase: DiscoverAIProvidersUseCase;
  selectAIProviderUseCase: SelectAIProviderUseCase;
  aiProviderRegistry: AIProviderRegistry;
  repository: FileReviewRepository;
  analysisService: AIAnalysisService;
  reviewService: CodeReviewService;
}

export async function getAIProviderConfigs(context: vscode.ExtensionContext): Promise<AIProviderConfig[]> {
  const config = vscode.workspace.getConfiguration('codeReview');
  let providerConfigs = config.get<AIProviderConfig[]>('ai.providers', []);

  // Fallback / Migration logic
  if (providerConfigs.length === 0) {
    const legacyProviderType = config.get<string>('provider', 'mock');
    const legacyConfig: AIProviderConfig = {
        id: 'default',
        type: legacyProviderType as any,
        label: `Default ${legacyProviderType}`,
        enabled: true,
        model: config.get<string>(`${legacyProviderType}.model`, ''),
        baseUrl: legacyProviderType === 'ollama' ? config.get<string>('ollama.baseUrl') : undefined,
        apiKey: legacyProviderType === 'openai' 
            ? async () => (await context.secrets.get('openai-api-key')) || ''
            : legacyProviderType === 'gemini'
            ? async () => (await context.secrets.get('gemini-api-key')) || ''
            : undefined
    };
    providerConfigs = [legacyConfig];
  }

  // Bind secrets
  providerConfigs.forEach(pc => {
    if (pc.type === 'openai' && !pc.apiKey) {
        pc.apiKey = async () => (await context.secrets.get('openai-api-key')) || '';
    } else if (pc.type === 'gemini' && !pc.apiKey) {
        pc.apiKey = async () => (await context.secrets.get('gemini-api-key')) || '';
    }
  });

  return providerConfigs;
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

  // Multi-provider logic
  const providerRegistry = new AIProviderRegistry();
  const discoveryService = new AIProviderDiscoveryService();
  
  const providerConfigsRaw = config.get<AIProviderConfig[]>('ai.providers', []);
  let activeProviderId = config.get<string>('ai.activeProviderId');

  // Sync initialization for buildContainer
  let initialConfigs = providerConfigsRaw;
  if (initialConfigs.length === 0) {
      const legacyProviderType = config.get<string>('provider', 'mock');
      initialConfigs = [{
          id: 'default',
          type: legacyProviderType as any,
          label: `Default ${legacyProviderType}`,
          enabled: true,
          model: config.get<string>(`${legacyProviderType}.model`, ''),
          baseUrl: legacyProviderType === 'ollama' ? config.get<string>('ollama.baseUrl') : undefined,
          apiKey: legacyProviderType === 'openai' 
            ? async () => (await context.secrets.get('openai-api-key')) || ''
            : legacyProviderType === 'gemini'
            ? async () => (await context.secrets.get('gemini-api-key')) || ''
            : undefined
      }];
      activeProviderId = 'default';
  }

  initialConfigs.forEach(pc => {
    // Re-bind secrets if necessary
    if (pc.type === 'openai' && !pc.apiKey) {
        pc.apiKey = async () => (await context.secrets.get('openai-api-key')) || '';
    } else if (pc.type === 'gemini' && !pc.apiKey) {
        pc.apiKey = async () => (await context.secrets.get('gemini-api-key')) || '';
    }
    providerRegistry.register(pc.id, AIProviderFactory.create(pc) as any);
  });

  if (activeProviderId && initialConfigs.some(p => p.id === activeProviderId)) {
    providerRegistry.setActiveProvider(activeProviderId);
  } else if (initialConfigs.length > 0) {
    providerRegistry.setActiveProvider(initialConfigs[0].id);
  }

  const aiAnalysisService = new AIAnalysisService(providerRegistry, contextBuilder, {
    timeout: config.get<number>('ai.timeout', 30000),
    maxRetries: config.get<number>('ai.retries', 2)
  });

  const heatmapService = new HeatmapService(repository);
  const codeReviewService = new CodeReviewService(repository);
  approveFindingUseCase: ApproveFindingUseCase;
  addCommentToFindingUseCase: AddCommentToFindingUseCase;
  deleteCodeReviewUseCase: DeleteCodeReviewUseCase;
  ...
  const approveFindingUseCase = new ApproveFindingUseCase(repository, ide);
  const addCommentToFindingUseCase = new AddCommentToFindingUseCase(repository);

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
    addCommentToFindingUseCase,
    deleteCodeReviewUseCase: new DeleteCodeReviewUseCase(repository),

    indexRepositoryRagUseCase: new IndexRepositoryRagUseCase(ragIndexingService),
    clearRepositoryRagUseCase: new ClearRepositoryRagUseCase(ragIndexingService),
    dashboardProvider: new DashboardProvider(heatmapService),
    ragStatusProvider: new RagStatusProvider(),
    reviewPanelProvider: new ReviewPanelProvider(repository, ide, approveFindingUseCase, context),
    discoverAIProvidersUseCase: new DiscoverAIProvidersUseCase(discoveryService),
    selectAIProviderUseCase: new SelectAIProviderUseCase(),
    aiProviderRegistry: providerRegistry,
    repository,
    analysisService: aiAnalysisService,
    reviewService: codeReviewService
  };
}
