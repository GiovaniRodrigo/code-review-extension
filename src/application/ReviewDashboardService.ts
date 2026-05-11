import { DashboardState, ReviewSessionRepository, GitService } from './interfaces';
import { calculateReviewMetrics } from '../telemetry/reviewMetrics';
import { buildAssistedIntelligenceReport } from './assistedIntelligence';
import { listIntegrationDescriptors } from './integrationDescriptors';
import { getTranslations } from '../shared/i18n';
import { LocalTtlCache } from './performanceCache';
import { buildReviewSessionKey } from './helpers';
import { PremiumPlan, ReviewSessionStatus, ReviewSession, getPremiumFeatureFlags } from '../domain';
import { resolveEditionRuntime } from '../editions/EditionResolver';
import { buildEditionPresentationState } from '../editions/shared/EditionPresentation';
import { AIProvider } from '../contracts';
import { buildEnterpriseFeatureState } from './EnterpriseFeatureService';

export class ReviewDashboardService {
  private readonly dashboardCache = new LocalTtlCache<DashboardState>(1500);

  constructor(
    private readonly repository: ReviewSessionRepository,
    private readonly gitService: GitService,
    private readonly plan: PremiumPlan = { edition: 'community' },
    private readonly communityAIProvider?: AIProvider
  ) {}

  async getDashboardState(user: string, language = 'en'): Promise<DashboardState> {
    const cached = this.dashboardCache.get(`dashboard-${user}-${language}`);
    if (cached) return cached;

    const [git, sessions] = await Promise.all([
      this.gitService.getContext(),
      this.repository.list()
    ]);
    const contextKey = buildReviewSessionKey(git);
    const currentSession = this.findActiveSessionForContext(sessions, contextKey);
    const visibleSessions = sessions.slice(0, 50);
    
    const editionRuntime = resolveEditionRuntime(this.plan, this.communityAIProvider);
    const editionPresentation = buildEditionPresentationState(editionRuntime);
    try {
      const model = await editionRuntime.aiProvider.getModelInfo();
      if (model.provider === 'ollama') {
        editionPresentation.aiStatus = `IA: Ollama conectado · ${model.model}`;
      } else if (model.provider === 'ollama-unavailable') {
        editionPresentation.aiStatus = `IA: Ollama configurado, mas modelo indisponível · ${model.model}`;
      }
    } catch (_error) {
      if (editionRuntime.aiProvider.id === 'community.ollama') {
        editionPresentation.aiStatus = 'IA: Ollama configurado, mas API indisponível';
      }
    }

    const state: DashboardState = {
      currentSession,
      git,
      sessions: visibleSessions,
      metrics: calculateReviewMetrics(sessions),
      intelligence: buildAssistedIntelligenceReport(currentSession, sessions),
      performance: {
        cacheEnabled: true,
        lazySessionLimit: 50,
        incrementalBatchSize: 25,
        asyncProcessingEnabled: true
      },
      integrations: listIntegrationDescriptors(),
      currentUser: user,
      translations: getTranslations(language),
      premium: {
        plan: this.sanitizedPlan(),
        features: getPremiumFeatureFlags(this.plan)
      },
      editionPresentation,
      enterprise: buildEnterpriseFeatureState({ git, sessions, currentSession, qualityScore: calculateReviewMetrics(sessions).qualityScore })
    };

    this.dashboardCache.set(`dashboard-${user}-${language}`, state);
    return state;
  }

  private sanitizedPlan(): PremiumPlan {
    const { accessToken: _accessToken, ...safePlan } = this.plan;
    return safePlan;
  }

  private findActiveSessionForContext(sessions: ReviewSession[], contextKey: string): ReviewSession | undefined {
    const matching = sessions.filter((session) => buildReviewSessionKey({
      currentBranch: session.sourceBranch,
      baseBranch: session.targetBranch,
      pullRequestId: session.pullRequestId,
      changedFiles: session.changedFiles,
      commits: session.commits
    }) === contextKey);

    if (!matching.length) return undefined;

    const openStatuses = new Set<ReviewSessionStatus>(['OPEN', 'IN_REVIEW', 'NEEDS_CHANGES', 'FIXED', 'REOPENED']);
    return matching.find((session) => openStatuses.has(session.status)) ?? matching[0];
  }

  clearCache(): void {
    this.dashboardCache.clear();
  }
}
