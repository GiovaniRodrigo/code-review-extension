import { ReviewSession } from '@code-review/domain';
import { ReviewRepository } from './index';

export class InMemoryReviewRepository implements ReviewRepository {
  private sessions: Map<string, ReviewSession> = new Map();

  async saveSession(session: ReviewSession): Promise<void> {
    this.sessions.set(session.id, session);
    console.log(`Session ${session.id} saved in memory.`);
  }

  async getSessionByBranch(branch: string): Promise<ReviewSession | null> {
    for (const session of this.sessions.values()) {
      if (session.branch === branch) return session;
    }
    return null;
  }

  async getSessionById(id: string): Promise<ReviewSession | null> {
    return this.sessions.get(id) || null;
  }

  async deleteSession(id: string): Promise<void> {
    this.sessions.delete(id);
  }
}
