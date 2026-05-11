import { ReviewSession, GitContext, ReviewSessionStatus, createReviewSession, updateReviewSessionGitContext, updateReviewSessionStatus } from '../domain';
import { ReviewSessionRepository, GitService, AuditService } from './interfaces';
import { buildReviewSessionKey } from './helpers';

export class ReviewLifecycleService {
  constructor(
    private readonly repository: ReviewSessionRepository,
    private readonly gitService: GitService,
    private readonly auditService?: AuditService
  ) {}

  async syncCurrentSessionWithGit(author: string, reviewer: string): Promise<ReviewSession | undefined> {
    const git = await this.gitService.getContext();
    const sessions = await this.repository.list();
    const contextKey = buildReviewSessionKey(git);
    const matchingSession = this.findActiveSessionForContext(sessions, contextKey);

    if (matchingSession) {
      const updated = updateReviewSessionGitContext(matchingSession, git);
      await this.saveAndAudit(updated);
      return updated;
    }

    const current = await this.repository.getCurrent();
    const currentKey = current ? buildReviewSessionKey({
      currentBranch: current.sourceBranch,
      baseBranch: current.targetBranch,
      pullRequestId: current.pullRequestId,
      changedFiles: current.changedFiles,
      commits: current.commits
    }) : undefined;

    if (current && currentKey === contextKey) {
      return current;
    }

    return undefined;
  }

  async startReview(author: string, reviewer: string, selection?: Partial<GitContext> & { title?: string; subtitle?: string }): Promise<ReviewSession> {
    const detectedGit = await this.gitService.getContext();
    const git: GitContext = {
      ...detectedGit,
      currentBranch: selection?.currentBranch?.trim() || detectedGit.currentBranch,
      baseBranch: selection?.baseBranch?.trim() || detectedGit.baseBranch,
      pullRequestId: selection?.pullRequestId?.trim() || detectedGit.pullRequestId,
      changedFiles: selection?.changedFiles?.length ? selection.changedFiles : detectedGit.changedFiles,
      commits: selection?.commits?.length ? selection.commits : detectedGit.commits
    };

    const session = createReviewSession({ git, author, reviewer, title: selection?.title, subtitle: selection?.subtitle });
    await this.saveAndAudit(session);
    return session;
  }

  async openReview(id: string): Promise<ReviewSession> {
    const session = await this.repository.getById(id);
    if (!session) throw new Error(`Review session nao encontrada: ${id}`);
    await this.saveAndAudit(session);
    return session;
  }

  async deleteReview(id: string): Promise<void> {
    if (!this.repository.delete) throw new Error('Repositorio atual nao oferece remocao permanente.');
    await this.repository.delete(id);
  }

  async updateStatus(id: string, status: ReviewSessionStatus, user: string): Promise<ReviewSession> {
    const session = await this.repository.getById(id);
    if (!session) throw new Error(`Review session nao encontrada: ${id}`);

    const updated = updateReviewSessionStatus(session, status, user);
    await this.saveAndAudit(updated);
    return updated;
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

  private async saveAndAudit(session: ReviewSession): Promise<void> {
    await this.repository.saveCurrent(session);
    await this.auditService?.registerSessionSnapshot(session);
  }
}
