import { DashboardState, ReviewSessionRepository, GitService } from './interfaces';
import { calculateReviewMetrics } from '../telemetry/reviewMetrics';
import { buildAssistedIntelligenceReport } from './assistedIntelligence';
import { listIntegrationDescriptors } from './integrationDescriptors';
import { getTranslations } from '../shared/i18n';
import { LocalTtlCache } from './performanceCache';
import { buildReviewSessionKey } from './helpers';
import { ReviewSessionStatus, ReviewSession } from '../domain';

export class ReviewDashboardService {
  private readonly dashboardCache = new LocalTtlCache<DashboardState>(1500);

  constructor(
    private readonly repository: ReviewSessionRepository,
    private readonly gitService: GitService
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
      translations: getTranslations(language)
    };

    this.dashboardCache.set(`dashboard-${user}-${language}`, state);
    return state;
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
