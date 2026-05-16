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
  AIProviderConfig,
  ReinforcementService,
  ValidateFindingUseCase,
  HeatmapService,
  AddCommentToFindingUseCase,
  RefactorFindingUseCase,
  ProjectChatUseCase,
  SyncWithVpsUseCase,
  VpsSyncService
} from '@code-review/core';
import { 
  AIProviderFactory, 
  MockAIProvider,
  GeminiMockProvider,
  FileReviewRepository,
  FileAuditLogService,
  SimpleRagContextBuilder,
  MemoryRagVectorStore,
  SimpleEmbeddingProvider,
  SimpleRagIndexer,
  TypeScriptAstBuilder,
  TypeScriptDependencyGraphBuilder,
  LinuxVpsProvider
} from '@code-review/infra';
import { VSCodeIdeAdapter } from '../adapters/ide/VSCodeIdeAdapter';
import { VSCodeWorkspaceAdapter } from '../adapters/ide/VSCodeWorkspaceAdapter';
import { VSCodeFileSystemAdapter } from '../adapters/ide/VSCodeFileSystemAdapter';
import { VSCodeCommandRegistryAdapter } from '../adapters/ide/VSCodeCommandRegistryAdapter';
import { VSCodeNotificationAdapter } from '../adapters/ide/VSCodeNotificationAdapter';
import { VSCodeStorageAdapter } from '../adapters/ide/VSCodeStorageAdapter';
import { DashboardProvider } from '../providers/DashboardProvider';
import { RagStatusProvider } from '../providers/RagStatusProvider';
import { ReviewPanelProvider } from '../providers/ReviewPanelProvider';
import { DependencyGraphProvider } from '../providers/DependencyGraphProvider';
import { ChatProvider } from '../providers/ChatProvider';

export interface VSCodeContainer {
  context: vscode.ExtensionContext;
  ide: VSCodeIdeAdapter;
  workspace: VSCodeWorkspaceAdapter;
  fileSystem: VSCodeFileSystemAdapter;
  commands: VSCodeCommandRegistryAdapter;
  notifications: VSCodeNotificationAdapter;
  storage: VSCodeStorageAdapter;
  analyzeCodeWithAIUseCase: AnalyzeCodeWithAIUseCase;
  createCodeReviewUseCase: CreateCodeReviewUseCase;
  getCodeReviewUseCase: GetCodeReviewUseCase;
  revalidateCodeReviewUseCase: RevalidateCodeReviewUseCase;
  projectChatUseCase: ProjectChatUseCase;
  approveFindingUseCase: ApproveFindingUseCase;
  addCommentToFindingUseCase: AddCommentToFindingUseCase;
  refactorFindingUseCase: RefactorFindingUseCase;
  deleteCodeReviewUseCase: DeleteCodeReviewUseCase;
  indexRepositoryRagUseCase: IndexRepositoryRagUseCase;
  clearRepositoryRagUseCase: ClearRepositoryRagUseCase;
  syncWithVpsUseCase: SyncWithVpsUseCase;
  dashboardProvider: DashboardProvider;
  ragStatusProvider: RagStatusProvider;
  reviewPanelProvider: ReviewPanelProvider;
  dependencyGraphProvider: DependencyGraphProvider;
  chatProvider: ChatProvider;
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
  
  if (providerConfigs.length === 0) {
    providerConfigs = [
      { 
        id: 'ollama-local', 
        label: 'Ollama (Local)', 
        type: 'ollama', 
        baseUrl: config.get<string>('ollama.baseUrl', 'http://localhost:11434'),
        model: config.get<string>('ollama.model', 'llama3'),
        enabled: true
      },
      { 
        id: 'openai-cloud', 
        label: 'OpenAI (Cloud)', 
        type: 'openai',
        model: config.get<string>('openai.model', 'gpt-4o-mini'),
        enabled: true
      },
      { 
        id: 'gemini-pro', 
        label: 'Gemini Pro', 
        type: 'gemini',
        model: config.get<string>('gemini.model', 'gemini-flash-latest'),
        enabled: true
      },
      {
        id: 'claude-3-5',
        label: 'Claude 3.5 Sonnet',
        type: 'claude',
        model: 'claude-3-5-sonnet-20240620',
        enabled: true
      }
    ];
  }

  return providerConfigs;
}

export async function buildContainer(context: vscode.ExtensionContext): Promise<VSCodeContainer> {
  const config = vscode.workspace.getConfiguration('codeReview');
  
  // Infrastructure
  const repository = new FileReviewRepository(context.globalStorageUri.fsPath);
  const auditLogService = new FileAuditLogService();
  const vectorStore = new MemoryRagVectorStore();
  const embeddingProvider = new SimpleEmbeddingProvider();
  const astBuilder = new TypeScriptAstBuilder();
  const ragIndexer = new SimpleRagIndexer(vectorStore, embeddingProvider, astBuilder, { storageDir: context.globalStorageUri.fsPath });
  const dependencyGraphBuilder = new TypeScriptDependencyGraphBuilder();
  
  // AI Registry
  const providerRegistry = new AIProviderRegistry();
  const initialConfigs = await getAIProviderConfigs(context);
  const activeProviderId = context.globalState?.get ? context.globalState.get<string>('activeAIProviderId') : undefined;

  const isE2E = process.env.CODE_REVIEW_E2E === 'true' || context.extensionMode === vscode.ExtensionMode.Test;
  console.log(`[CONTAINER] isE2E: ${isE2E} (Env: ${process.env.CODE_REVIEW_E2E}, Mode: ${context.extensionMode})`);

  if (isE2E) {
    providerRegistry.register('mock', new MockAIProvider() as any);
    providerRegistry.setActiveProvider('mock');
    
    // Register mock for all initial configs too, just in case
    initialConfigs.forEach(pc => {
        if (pc.type === 'gemini') {
            providerRegistry.register(pc.id, new GeminiMockProvider() as any);
        } else {
            providerRegistry.register(pc.id, new MockAIProvider() as any);
        }
    });
  } else {
    initialConfigs.forEach(pc => {
        // Re-bind secrets if necessary
        if (pc.type === 'openai' && !pc.apiKey) {
            pc.apiKey = async () => (context.secrets?.get ? (await context.secrets.get('openai-api-key')) : '') || '';
        } else if (pc.type === 'gemini' && !pc.apiKey) {
            pc.apiKey = async () => (context.secrets?.get ? (await context.secrets.get('gemini-api-key')) : '') || '';
        }
        providerRegistry.register(pc.id, AIProviderFactory.create(pc) as any);
    });

    if (activeProviderId && initialConfigs.some(p => p.id === activeProviderId)) {
        providerRegistry.setActiveProvider(activeProviderId);
    } else if (initialConfigs.length > 0) {
        providerRegistry.setActiveProvider(initialConfigs[0].id);
    }
  }

  const contextBuilder = new SimpleRagContextBuilder(vectorStore, embeddingProvider);
  const reinforcementService = new ReinforcementService(vectorStore, embeddingProvider);

  const aiAnalysisService = new AIAnalysisService(providerRegistry, contextBuilder, reinforcementService, undefined, undefined, astBuilder as any, {
    timeout: config.get<number>('ai.timeout', 30000),
    maxRetries: config.get<number>('ai.retries', 2),
    maskData: config.get<boolean>('privacy.maskData', true)
  });

  const heatmapService = new HeatmapService(repository);
  const codeReviewService = new CodeReviewService(repository);
  const ragIndexingService = new RagIndexingService(ragIndexer);
  const vpsSyncService = new VpsSyncService(new LinuxVpsProvider() as any, repository);
  
  const ide = new VSCodeIdeAdapter();
  const fileSystem = new VSCodeFileSystemAdapter();
  const projectChatUseCase = new ProjectChatUseCase(providerRegistry, contextBuilder, new VSCodeWorkspaceAdapter(), fileSystem, dependencyGraphBuilder);
  const validateFindingUseCase = new ValidateFindingUseCase(repository, ide, reinforcementService, auditLogService);
  const addCommentToFindingUseCase = new AddCommentToFindingUseCase(repository);
  const refactorFindingUseCase = new RefactorFindingUseCase(repository, aiAnalysisService, ide);
  const discoveryService = new AIProviderDiscoveryService();

  return {
    context,
    ide,
    workspace: new VSCodeWorkspaceAdapter(),
    fileSystem,
    commands: new VSCodeCommandRegistryAdapter(context),
    notifications: new VSCodeNotificationAdapter(),
    storage: new VSCodeStorageAdapter(context),
    analyzeCodeWithAIUseCase: new AnalyzeCodeWithAIUseCase(aiAnalysisService),
    createCodeReviewUseCase: new CreateCodeReviewUseCase(codeReviewService),
    getCodeReviewUseCase: new GetCodeReviewUseCase(codeReviewService),
    revalidateCodeReviewUseCase: new RevalidateCodeReviewUseCase(aiAnalysisService, codeReviewService),
    projectChatUseCase,
    approveFindingUseCase: validateFindingUseCase as any,
    addCommentToFindingUseCase,
    refactorFindingUseCase,
    deleteCodeReviewUseCase: new DeleteCodeReviewUseCase(repository),

    indexRepositoryRagUseCase: new IndexRepositoryRagUseCase(ragIndexingService),
    clearRepositoryRagUseCase: new ClearRepositoryRagUseCase(ragIndexingService),
    syncWithVpsUseCase: new SyncWithVpsUseCase(vpsSyncService),
    dashboardProvider: new DashboardProvider(heatmapService, auditLogService),
    ragStatusProvider: new RagStatusProvider(),
    dependencyGraphProvider: new DependencyGraphProvider(
        new VSCodeWorkspaceAdapter(),
        fileSystem,
        dependencyGraphBuilder
    ),
    chatProvider: new ChatProvider(projectChatUseCase),
    reviewPanelProvider: new ReviewPanelProvider(repository, ide, validateFindingUseCase as any, context),
    discoverAIProvidersUseCase: new DiscoverAIProvidersUseCase(discoveryService),
    selectAIProviderUseCase: new SelectAIProviderUseCase(),
    aiProviderRegistry: providerRegistry,
    repository,
    analysisService: aiAnalysisService,
    reviewService: codeReviewService
  };
}
