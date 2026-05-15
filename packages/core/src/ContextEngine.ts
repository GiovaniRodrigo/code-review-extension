import { CodeReviewRepositoryPort } from './ports/review/CodeReviewRepositoryPort';

export class ContextEngine {
  constructor(private readonly repository: CodeReviewRepositoryPort) {}

  async buildContext(filePath: string): Promise<string> {
    const sessions = await this.repository.getAllSessions();
    const allFindings = sessions.flatMap(s => s.findings);
    
    const approved = allFindings.filter(f => f.status === 'approved');
    const rejected = allFindings.filter(f => f.status === 'rejected');

    if (approved.length === 0 && rejected.length === 0) {
      return '';
    }

    let context = 'User feedback from previous reviews:\n';
    
    if (approved.length > 0) {
      context += '\nApproved findings (examples of what to look for):\n';
      approved.slice(-5).forEach(f => {
        context += `- [${f.file}] ${f.message}\n`;
      });
    }

    if (rejected.length > 0) {
      context += '\nRejected findings (examples of false positives to avoid):\n';
      rejected.slice(-5).forEach(f => {
        context += `- [${f.file}] ${f.message}\n`;
      });
    }

    return context;
  }
}
