import { ReviewRepository, GitProvider } from '@code-review/infra';
import { Finding } from '@code-review/domain';

export interface PublishPRReviewInput {
  sessionId: string;
  owner: string;
  repo: string;
  prNumber: number;
}

export class PublishPRReviewUseCase {
  constructor(
    private repository: ReviewRepository,
    private gitProvider: GitProvider
  ) {}

  async execute(input: PublishPRReviewInput): Promise<void> {
    const session = await this.repository.getSessionById(input.sessionId);
    if (!session) {
      throw new Error(`Session ${input.sessionId} not found`);
    }

    const approvedFindings = session.findings.filter(f => f.status === 'approved');
    if (approvedFindings.length === 0) {
      throw new Error('No approved findings to publish');
    }

    const comments = approvedFindings.map(f => ({
      file: f.file,
      line: f.line,
      body: this._formatComment(f)
    }));

    await this.gitProvider.publishComments(
      input.owner,
      input.repo,
      input.prNumber,
      comments
    );
  }

  private _formatComment(finding: Finding): string {
    return `**[AI Code Review]** ${finding.severity.toUpperCase()}: ${finding.message}${finding.suggestedFix ? `\n\n**Suggested Fix:**\n\`\`\`\n${finding.suggestedFix}\n\`\`\`` : ''}`;
  }
}
