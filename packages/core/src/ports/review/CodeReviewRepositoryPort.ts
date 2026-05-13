import { ReviewSession } from '@code-review/domain';

export interface CodeReviewRepositoryPort {
  saveSession(session: ReviewSession): Promise<void>;
  getSessionByBranch(branch: string): Promise<ReviewSession | null>;
  getSessionById(id: string): Promise<ReviewSession | null>;
  getAllSessions(): Promise<ReviewSession[]>;
  deleteSession(id: string): Promise<void>;
}
