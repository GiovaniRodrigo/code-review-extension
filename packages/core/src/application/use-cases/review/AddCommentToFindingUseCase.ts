import { FindingComment, ReviewSession } from '@code-review/domain';
import { CodeReviewRepositoryPort } from '../../../ports/review/CodeReviewRepositoryPort';

export interface AddCommentInput {
  sessionId: string;
  findingId: string;
  author: 'developer' | 'ai';
  body: string;
}

export class AddCommentToFindingUseCase {
  constructor(private readonly repository: CodeReviewRepositoryPort) {}

  async execute(input: AddCommentInput): Promise<ReviewSession> {
    const session = await this.repository.getSessionById(input.sessionId);
    if (!session) {
      throw new Error(`Session ${input.sessionId} not found`);
    }

    const finding = session.findings.find(f => f.id === input.findingId);
    if (!finding) {
      throw new Error(`Finding ${input.findingId} not found in session`);
    }

    const comment: FindingComment = {
      id: `comment-${Date.now()}`,
      author: input.author,
      body: input.body,
      createdAt: new Date()
    };

    if (!finding.discussion) {
      finding.discussion = [];
    }

    finding.discussion.push(comment);
    session.updatedAt = new Date();

    await this.repository.saveSession(session);
    return session;
  }
}
