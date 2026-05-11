import * as vscode from 'vscode';
import { ReviewSession } from '../domain';
import { ReviewSessionRepository } from '../application';

const CURRENT_SESSION_KEY = 'giovaniCodeReview.currentSession';
const SESSIONS_KEY = 'giovaniCodeReview.sessions';

export class VscodeReviewSessionRepository implements ReviewSessionRepository {
  constructor(private readonly context: vscode.ExtensionContext) {}

  async getCurrent(): Promise<ReviewSession | undefined> {
    return this.context.workspaceState.get<ReviewSession>(CURRENT_SESSION_KEY);
  }

  async list(): Promise<ReviewSession[]> {
    const sessions = this.context.workspaceState.get<ReviewSession[]>(SESSIONS_KEY, []);
    return [...sessions].sort((a, b) => {
      const aTime = Date.parse(a.updatedAt || a.createdAt || '');
      const bTime = Date.parse(b.updatedAt || b.createdAt || '');
      return (Number.isNaN(bTime) ? 0 : bTime) - (Number.isNaN(aTime) ? 0 : aTime);
    });
  }

  async getById(id: string): Promise<ReviewSession | undefined> {
    const sessions = await this.list();
    return sessions.find((session) => session.id === id);
  }

  async saveCurrent(session: ReviewSession): Promise<void> {
    const sessions = await this.list();
    const nextSessions = [session, ...sessions.filter((item) => item.id !== session.id)];

    await this.context.workspaceState.update(CURRENT_SESSION_KEY, session);
    await this.context.workspaceState.update(SESSIONS_KEY, nextSessions);
  }
}
