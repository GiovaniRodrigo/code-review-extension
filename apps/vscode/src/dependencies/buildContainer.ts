import * as vscode from 'vscode';
import {
  AIAnalysisService,
  AnalyzeCodeWithAIUseCase,
  AnalyzeBranchCommitsUseCase,
  AnalyzeWorkspaceUseCase,
  CodeReviewService,
  CreateCodeReviewUseCase,
  GetCodeReviewUseCase,
  RevalidateCodeReviewUseCase,
  ApproveFindingUseCase,
  DeleteCodeReviewUseCase,
  IndexRepositoryRagUseCase,
  ClearRepositoryRagUseCase,
  SearchRagContextUseCase,
  RagIndexingService,
  RagContextService,
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
  VpsSyncService,
  AnalyzePrUseCase,
  GeneratePRSummaryUseCase,
  GenerateQualityReportUseCase,
  PublishCodeReviewUseCase
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
  LinuxVpsProvider,
  LocalReviewPublisher
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

import { AnalyzeCommandHandler } from '../commands/handlers/AnalyzeCommandHandler';
import { ApproveFindingCommandHandler } from '../commands/handlers/ApproveFindingCommandHandler';
import { IndexRepositoryRagCommandHandler } from '../commands/handlers/IndexRepositoryRagCommandHandler';
import { SetProviderCommandHandler } from '../commands/handlers/SetProviderCommandHandler';
import { SetOpenAIApiKeyCommandHandler } from '../commands/handlers/SetOpenAIApiKeyCommandHandler';
import { SetGeminiApiKeyCommandHandler } from '../commands/handlers/SetGeminiApiKeyCommandHandler';
import { SyncWithVpsCommandHandler } from '../commands/handlers/SyncWithVpsCommandHandler';
import { ClearRepositoryRagCommandHandler } from '../commands/handlers/ClearRepositoryRagCommandHandler';
import { SetupCommandHandler } from '../commands/handlers/SetupCommandHandler';
import { AnalyzeWorkspaceCommandHandler } from '../commands/handlers/AnalyzeWorkspaceCommandHandler';
import { AnalyzeBranchCommitsCommandHandler } from '../commands/handlers/AnalyzeBranchCommitsCommandHandler';
import { AnalyzePrCommandHandler } from '../commands/handlers/AnalyzePrCommandHandler';
import { GeneratePRSummaryCommandHandler } from '../commands/handlers/GeneratePRSummaryCommandHandler';
import { GenerateQualityReportCommandHandler } from '../commands/handlers/GenerateQualityReportCommandHandler';
import { ClearSessionCommandHandler } from '../commands/handlers/ClearSessionCommandHandler';
import { RestoreSessionCommandHandler } from '../commands/handlers/RestoreSessionCommandHandler';
import { PublishPrReviewCommandHandler } from '../commands/handlers/PublishPrReviewCommandHandler';
import { SearchRepositoryContextCommandHandler } from '../commands/handlers/SearchRepositoryContextCommandHandler';
import { RunDiagnosticsCommandHandler } from '../commands/handlers/RunDiagnosticsCommandHandler';
import { ExportMarkdownCommandHandler } from '../commands/handlers/ExportMarkdownCommandHandler';
import { SetupOllamaCommandHandler } from '../commands/handlers/SetupOllamaCommandHandler';
import { RevalidateSessionCommandHandler } from '../commands/handlers/RevalidateSessionCommandHandler';
import { ConfigureCloudProviderCommandHandler } from '../commands/handlers/ConfigureCloudProviderCommandHandler';
import { TestAIProviderCommandHandler } from '../commands/handlers/TestAIProviderCommandHandler';
import { ExportPdfCommandHandler } from '../commands/handlers/ExportPdfCommandHandler';
import { SelectReviewTemplateCommandHandler } from '../commands/handlers/SelectReviewTemplateCommandHandler';
import { ShowProUpgradeCommandHandler } from '../commands/handlers/ShowProUpgradeCommandHandler';
import { OpenReviewHistoryCommandHandler } from '../commands/handlers/OpenReviewHistoryCommandHandler';

export interface VSCodeContainer {
  context: vscode.ExtensionContext;
  ide: VSCodeIdeAdapter;
  workspace: VSCodeWorkspaceAdapter;
  fileSystem: VSCodeFileSystemAdapter;
  commands: VSCodeCommandRegistryAdapter;
  notifications: VSCodeNotificationAdapter;
  storage: VSCodeStorageAdapter;
  analyzeCodeWithAIUseCase: AnalyzeCodeWithAIUseCase;
  analyzeBranchCommitsUseCase: AnalyzeBranchCommitsUseCase;
  analyzeWorkspaceUseCase: AnalyzeWorkspaceUseCase;
  analyzePrUseCase: AnalyzePrUseCase;
  generatePRSummaryUseCase: GeneratePRSummaryUseCase;
  generateQualityReportUseCase: GenerateQualityReportUseCase;
  publishCodeReviewUseCase: PublishCodeReviewUseCase;
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
  searchRagContextUseCase: SearchRagContextUseCase;
  syncWithVpsUseCase: SyncWithVpsUseCase;
  dashboardProvider: DashboardProvider;
  ragStatusProvider: RagStatusProvider;
  dependencyGraphProvider: DependencyGraphProvider;
  chatProvider: ChatProvider;
  reviewPanelProvider: ReviewPanelProvider;
  discoverAIProvidersUseCase: DiscoverAIProvidersUseCase;
  selectAIProviderUseCase: SelectAIProviderUseCase;
  aiProviderRegistry: AIProviderRegistry;
  repository: FileReviewRepository;
  analysisService: AIAnalysisService;
  reviewService: CodeReviewService;

  // Command Handlers
  analyzeCommandHandler: AnalyzeCommandHandler;
  approveFindingCommandHandler: ApproveFindingCommandHandler;
  indexRepositoryRagCommandHandler: IndexRepositoryRagCommandHandler;
  setProviderCommandHandler: SetProviderCommandHandler;
  setOpenAIApiKeyCommandHandler: SetOpenAIApiKeyCommandHandler;
  setGeminiApiKeyCommandHandler: SetGeminiApiKeyCommandHandler;
  syncWithVpsCommandHandler: SyncWithVpsCommandHandler;
  clearRepositoryRagCommandHandler: ClearRepositoryRagCommandHandler;
  setupCommandHandler: SetupCommandHandler;
  analyzeWorkspaceCommandHandler: AnalyzeWorkspaceCommandHandler;
  analyzeBranchCommitsCommandHandler: AnalyzeBranchCommitsCommandHandler;
  analyzePrCommandHandler: AnalyzePrCommandHandler;
  generatePRSummaryCommandHandler: GeneratePRSummaryCommandHandler;
  generateQualityReportCommandHandler: GenerateQualityReportCommandHandler;
  clearSessionCommandHandler: ClearSessionCommandHandler;
  restoreSessionCommandHandler: RestoreSessionCommandHandler;
  publishPrReviewCommandHandler: PublishPrReviewCommandHandler;
  searchRepositoryContextCommandHandler: SearchRepositoryContextCommandHandler;
  runDiagnosticsCommandHandler: RunDiagnosticsCommandHandler;
  exportMarkdownCommandHandler: ExportMarkdownCommandHandler;
  setupOllamaCommandHandler: SetupOllamaCommandHandler;
  revalidateSessionCommandHandler: RevalidateSessionCommandHandler;
  configureCloudProviderCommandHandler: ConfigureCloudProviderCommandHandler;
  testAIProviderCommandHandler: TestAIProviderCommandHandler;
  exportPdfCommandHandler: ExportPdfCommandHandler;
  selectReviewTemplateCommandHandler: SelectReviewTemplateCommandHandler;
  showProUpgradeCommandHandler: ShowProUpgradeCommandHandler;
  openReviewHistoryCommandHandler: OpenReviewHistoryCommandHandler;
}

export async function getAIProviderConfigs(context: vscode.ExtensionContext): Promise<AIProviderConfig[]> {
  const config = vscode.workspace.getConfiguration('codeReview');
  const configured = config.get<AIProviderConfig[]>('ai.providers', []);

  const defaults: AIProviderConfig[] = [
    { id: 'mock', label: 'Mock (Offline Safety Fallback)', type: 'mock', model: 'mock-model', enabled: true },
    { id: 'ollama-local', label: 'Ollama (Local)', type: 'ollama', baseUrl: config.get<string>('ollama.baseUrl', 'http://localhost:11434'), model: config.get<string>('ollama.model', 'llama3'), enabled: true },
    { id: 'openai-cloud', label: 'OpenAI (Cloud)', type: 'openai', apiKey: async () => (context.secrets?.get ? (await context.secrets.get('openai-api-key')) : '') || '', model: config.get<string>('openai.model', 'gpt-4o-mini'), enabled: true },
    { id: 'gemini-pro', label: 'Gemini Pro', type: 'gemini', apiKey: async () => (context.secrets?.get ? (await context.secrets.get('gemini-api-key')) : '') || '', model: config.get<string>('gemini.model', 'gemini-flash-latest'), enabled: true }
  ];

  const providerById = new Map<string, AIProviderConfig>();
  for (const provider of defaults) providerById.set(provider.id, provider);

  for (const provider of configured) {
    if (!provider?.id || provider.enabled === false) continue;
    const normalized: AIProviderConfig = { ...provider, model: provider.model || defaults.find(d => d.type === provider.type)?.model || 'default', enabled: true };
    if (normalized.type === 'openai' && !normalized.apiKey) normalized.apiKey = async () => (context.secrets?.get ? (await context.secrets.get('openai-api-key')) : '') || '';
    if (normalized.type === 'gemini' && !normalized.apiKey) normalized.apiKey = async () => (context.secrets?.get ? (await context.secrets.get('gemini-api-key')) : '') || '';
    providerById.set(normalized.id, normalized);
  }
  return Array.from(providerById.values());
}

export async function buildContainer(context: vscode.ExtensionContext): Promise<VSCodeContainer> {
  const config = vscode.workspace.getConfiguration('codeReview');
  
  // Infrastructure
  const repository = new FileReviewRepository(context.globalStorageUri.fsPath);
  const auditLogService = new FileAuditLogService();
  const vectorStore = new MemoryRagVectorStore();
  const embeddingProvider = new SimpleEmbeddingProvider();
  const astBuilder = new TypeScriptAstBuilder();
  const ragIndexer = new SimpleRagIndexer(vectorStore, embeddingProvider, astBuilder, {
    storageDir: context.globalStorageUri.fsPath,
    ignoredFolders: ['node_modules', '.git', 'dist', 'build', 'coverage', 'out', '.turbo', '.vscode-test', '.next', '.nuxt', '.output', 'vendor', 'storage']
  });
  const dependencyGraphBuilder = new TypeScriptDependencyGraphBuilder();
  
  // AI Registry
  const providerRegistry = new AIProviderRegistry();
  const initialConfigs = await getAIProviderConfigs(context);
  const configuredActiveProviderId = config.get<string>('ai.activeProviderId', '') || (context.globalState?.get ? context.globalState.get<string>('activeAIProviderId') : undefined);
  const legacyProvider = config.get<string>('provider', 'mock');
  const activeProviderId = configuredActiveProviderId || (legacyProvider === 'mock' ? 'mock' : undefined);

  const isE2E = process.env.CODE_REVIEW_E2E === 'true' || 
                (vscode.ExtensionMode && context.extensionMode === vscode.ExtensionMode.Test);
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
    } else if (initialConfigs.some(p => p.id === 'mock')) {
        providerRegistry.setActiveProvider('mock');
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
  const localReviewPublisher = new LocalReviewPublisher();
  
  const ide = new VSCodeIdeAdapter();
  const fileSystem = new VSCodeFileSystemAdapter();
  const workspaceAdapter = new VSCodeWorkspaceAdapter();
  const analyzeWorkspaceUseCase = new AnalyzeWorkspaceUseCase(
    workspaceAdapter,
    fileSystem,
    aiAnalysisService,
    codeReviewService,
    auditLogService
  );
  const projectChatUseCase = new ProjectChatUseCase(providerRegistry, contextBuilder, workspaceAdapter, fileSystem, dependencyGraphBuilder);
  const validateFindingUseCase = new ValidateFindingUseCase(repository, ide, reinforcementService, auditLogService);
  const approveFindingUseCase = new ApproveFindingUseCase(repository, ide);
  const addCommentToFindingUseCase = new AddCommentToFindingUseCase(repository);
  const refactorFindingUseCase = new RefactorFindingUseCase(repository, aiAnalysisService, ide);
  const discoveryService = new AIProviderDiscoveryService();
  const searchRagContextUseCase = new SearchRagContextUseCase(new RagContextService(contextBuilder));

  const container: VSCodeContainer = {
    context,
    ide,
    workspace: workspaceAdapter,
    fileSystem,
    commands: new VSCodeCommandRegistryAdapter(context),
    notifications: new VSCodeNotificationAdapter(),
    storage: new VSCodeStorageAdapter(context),
    analyzeCodeWithAIUseCase: new AnalyzeCodeWithAIUseCase(aiAnalysisService),
    analyzeBranchCommitsUseCase: new AnalyzeBranchCommitsUseCase(ide, aiAnalysisService, codeReviewService),
    analyzeWorkspaceUseCase,
    analyzePrUseCase: new AnalyzePrUseCase(ide, aiAnalysisService, codeReviewService),
    generatePRSummaryUseCase: new GeneratePRSummaryUseCase(repository, providerRegistry, ide),
    generateQualityReportUseCase: new GenerateQualityReportUseCase(repository),
    publishCodeReviewUseCase: new PublishCodeReviewUseCase(localReviewPublisher),
    createCodeReviewUseCase: new CreateCodeReviewUseCase(codeReviewService),
    getCodeReviewUseCase: new GetCodeReviewUseCase(codeReviewService),
    revalidateCodeReviewUseCase: new RevalidateCodeReviewUseCase(aiAnalysisService, codeReviewService),
    projectChatUseCase,
    approveFindingUseCase,
    addCommentToFindingUseCase,
    refactorFindingUseCase,
    deleteCodeReviewUseCase: new DeleteCodeReviewUseCase(repository),

    indexRepositoryRagUseCase: new IndexRepositoryRagUseCase(ragIndexingService),
    clearRepositoryRagUseCase: new ClearRepositoryRagUseCase(ragIndexingService),
    searchRagContextUseCase,
    syncWithVpsUseCase: new SyncWithVpsUseCase(vpsSyncService),
    dashboardProvider: new DashboardProvider(heatmapService, auditLogService, providerRegistry, repository, ide),
    ragStatusProvider: new RagStatusProvider(ragIndexingService),
    dependencyGraphProvider: new DependencyGraphProvider(
        workspaceAdapter,
        fileSystem,
        dependencyGraphBuilder
    ),
    chatProvider: new ChatProvider(projectChatUseCase),
    reviewPanelProvider: new ReviewPanelProvider(
        repository, 
        ide, 
        approveFindingUseCase, 
        refactorFindingUseCase,
        addCommentToFindingUseCase,
        context
    ),
    discoverAIProvidersUseCase: new DiscoverAIProvidersUseCase(discoveryService),
    selectAIProviderUseCase: new SelectAIProviderUseCase(),
    aiProviderRegistry: providerRegistry,
    repository,
    analysisService: aiAnalysisService,
    reviewService: codeReviewService,

    // Handlers initialized below to avoid self-reference issues if any
    analyzeCommandHandler: null as any,
    approveFindingCommandHandler: null as any,
    indexRepositoryRagCommandHandler: null as any,
    setProviderCommandHandler: null as any,
    setOpenAIApiKeyCommandHandler: null as any,
    setGeminiApiKeyCommandHandler: null as any,
    syncWithVpsCommandHandler: null as any,
    clearRepositoryRagCommandHandler: null as any,
    setupCommandHandler: null as any,
    analyzeWorkspaceCommandHandler: null as any,
    analyzeBranchCommitsCommandHandler: null as any,
    analyzePrCommandHandler: null as any,
    generatePRSummaryCommandHandler: null as any,
    generateQualityReportCommandHandler: null as any,
    clearSessionCommandHandler: null as any,
    restoreSessionCommandHandler: null as any,
    publishPrReviewCommandHandler: null as any,
    searchRepositoryContextCommandHandler: null as any,
    runDiagnosticsCommandHandler: null as any,
    exportMarkdownCommandHandler: null as any,
    setupOllamaCommandHandler: null as any,
    revalidateSessionCommandHandler: null as any,
    configureCloudProviderCommandHandler: null as any,
    testAIProviderCommandHandler: null as any,
    exportPdfCommandHandler: null as any,
    selectReviewTemplateCommandHandler: null as any,
    showProUpgradeCommandHandler: null as any,
    openReviewHistoryCommandHandler: null as any
  };

  container.analyzeCommandHandler = new AnalyzeCommandHandler(container);
  container.approveFindingCommandHandler = new ApproveFindingCommandHandler(container);
  container.indexRepositoryRagCommandHandler = new IndexRepositoryRagCommandHandler(container);
  container.setProviderCommandHandler = new SetProviderCommandHandler(container);
  container.setOpenAIApiKeyCommandHandler = new SetOpenAIApiKeyCommandHandler(container);
  container.setGeminiApiKeyCommandHandler = new SetGeminiApiKeyCommandHandler(container);
  container.syncWithVpsCommandHandler = new SyncWithVpsCommandHandler(container);
  container.clearRepositoryRagCommandHandler = new ClearRepositoryRagCommandHandler(container);
  container.setupCommandHandler = new SetupCommandHandler(container);
  container.analyzeWorkspaceCommandHandler = new AnalyzeWorkspaceCommandHandler(container);
  container.analyzeBranchCommitsCommandHandler = new AnalyzeBranchCommitsCommandHandler(container);
  container.analyzePrCommandHandler = new AnalyzePrCommandHandler(container);
  container.generatePRSummaryCommandHandler = new GeneratePRSummaryCommandHandler(container);
  container.generateQualityReportCommandHandler = new GenerateQualityReportCommandHandler(container);
  container.clearSessionCommandHandler = new ClearSessionCommandHandler(container);
  container.restoreSessionCommandHandler = new RestoreSessionCommandHandler(container);
  container.publishPrReviewCommandHandler = new PublishPrReviewCommandHandler(container);
  container.searchRepositoryContextCommandHandler = new SearchRepositoryContextCommandHandler(container);
  container.runDiagnosticsCommandHandler = new RunDiagnosticsCommandHandler(container);
  container.exportMarkdownCommandHandler = new ExportMarkdownCommandHandler(container);
  container.setupOllamaCommandHandler = new SetupOllamaCommandHandler(container);
  container.revalidateSessionCommandHandler = new RevalidateSessionCommandHandler(container);
  container.configureCloudProviderCommandHandler = new ConfigureCloudProviderCommandHandler(container);
  container.testAIProviderCommandHandler = new TestAIProviderCommandHandler(container);
  container.exportPdfCommandHandler = new ExportPdfCommandHandler(container);
  container.selectReviewTemplateCommandHandler = new SelectReviewTemplateCommandHandler(container);
  container.showProUpgradeCommandHandler = new ShowProUpgradeCommandHandler(container);
  container.openReviewHistoryCommandHandler = new OpenReviewHistoryCommandHandler(container);

  return container;
}
