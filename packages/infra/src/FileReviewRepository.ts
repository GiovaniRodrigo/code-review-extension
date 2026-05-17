import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ReviewSession } from '@code-review/domain';
import { CodeReviewRepositoryPort } from '@code-review/core';

interface StoredReviewSession extends Omit<ReviewSession, 'createdAt' | 'updatedAt'> {
  createdAt: string;
  updatedAt: string;
}

export class FileReviewRepository implements CodeReviewRepositoryPort {
  private readonly filePath: string;

  constructor(private readonly storageDir: string) {
    this.filePath = join(storageDir, 'review-sessions.json');
  }

  async saveSession(session: ReviewSession): Promise<void> {
    const sessions = await this._readSessions();
    sessions.set(session.id, session);
    await this._writeSessions([...sessions.values()]);
  }

  async getSessionByBranch(branch: string): Promise<ReviewSession | null> {
    const sessions = await this._readSessions();
    return [...sessions.values()]
      .filter(session => session.branch === branch)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())[0] || null;
  }

  async getSessionById(id: string): Promise<ReviewSession | null> {
    const sessions = await this._readSessions();
    return sessions.get(id) || null;
  }

  async getAllSessions(): Promise<ReviewSession[]> {
    const sessions = await this._readSessions();
    return [...sessions.values()];
  }

  async deleteSession(id: string): Promise<void> {
    const sessions = await this._readSessions();
    sessions.delete(id);
    await this._writeSessions([...sessions.values()]);
  }

  private async _readSessions(): Promise<Map<string, ReviewSession>> {
    try {
      const raw = await readFile(this.filePath, 'utf8');
      const stored = JSON.parse(raw) as StoredReviewSession[];
      return new Map(stored.map(session => [session.id, this._fromStored(session)]));
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return new Map();
      }

      throw error;
    }
  }

  private async _writeSessions(sessions: ReviewSession[]): Promise<void> {
    await mkdir(this.storageDir, { recursive: true });
    await writeFile(
      this.filePath,
      JSON.stringify(sessions.map(session => this._toStored(session)), null, 2),
      'utf8'
    );
  }

  private _toStored(session: ReviewSession): StoredReviewSession {
    return {
      ...session,
      createdAt: session.createdAt.toISOString(),
      updatedAt: session.updatedAt.toISOString()
    };
  }

  private _fromStored(session: StoredReviewSession): ReviewSession {
    return {
      ...session,
      createdAt: new Date(session.createdAt),
      updatedAt: new Date(session.updatedAt),
      comments: session.comments || []
    };
  }
}
