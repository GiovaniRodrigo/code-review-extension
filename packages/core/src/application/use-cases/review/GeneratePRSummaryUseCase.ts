import { AIProviderPort } from '../../../ports/ai/AIProviderPort';
import { CodeReviewRepositoryPort } from '../../../ports/review/CodeReviewRepositoryPort';
import { IdeAdapterPort } from '../../../ports/ide/IdeAdapterPort';

export interface PRSummaryResult {
  title: string;
  markdown: string;
}

export class GeneratePRSummaryUseCase {
  constructor(
    private readonly repository: CodeReviewRepositoryPort,
    private readonly aiProvider: AIProviderPort,
    private readonly ide: IdeAdapterPort
  ) {}

  async execute(branch: string, baseBranch = 'main'): Promise<PRSummaryResult> {
    const session = await this.repository.getSessionByBranch(branch);
    const diff = await this.ide.getBranchDiff?.(baseBranch) || '';
    const findings = session?.findings || [];
    const approvedFindings = findings.filter(f => f.status === 'approved');
    const pendingFindings = findings.filter(f => f.status === 'pending');
    const findingsContext = findings
      .slice(0, 50)
      .map(f => `- [${f.severity}] ${f.file}:${f.line}: ${f.message} (status: ${f.status})`)
      .join('\n');

    const prompt = `You are helping a professional code reviewer prepare a Pull Request description.\n\nReturn Markdown only. Do not wrap in code fences.\n\nContext:\n- Current branch: ${branch}\n- Base branch: ${baseBranch}\n- Approved findings: ${approvedFindings.length}\n- Pending findings: ${pendingFindings.length}\n\nRequired sections:\n# Pull Request Summary\n## Overview\n## What Changed\n## Files and Areas Impacted\n## Technical Risks\n## Review Checklist\n## Testing Notes\n## Reviewer Notes\n\nGit diff, truncated:\n${diff.substring(0, 18000)}\n\nReview findings:\n${findingsContext || 'No findings recorded yet.'}\n`;

    const markdown = await this.generateMarkdown(prompt, branch, baseBranch, findings.length);

    return {
      title: `PR Summary: ${branch}`,
      markdown
    };
  }

  private async generateMarkdown(prompt: string, branch: string, baseBranch: string, findingCount: number): Promise<string> {
    try {
      const response = await this.aiProvider.chat({
        messages: [
          { role: 'system', content: 'You generate concise, professional Pull Request summaries for code reviewers.' },
          { role: 'user', content: prompt }
        ]
      });

      if (response.answer?.trim()) return this.ensureSummaryShape(response.answer.trim(), branch, baseBranch, findingCount);
    } catch {
      // Some providers only support structured analysis. Fall back below.
    }

    try {
      const response = await this.aiProvider.analyzeCode({
        code: prompt,
        filePath: 'pr-summary-request',
        mode: 'standard'
      });
      const body = response.findings?.[0]?.message || '';
      if (body.trim()) return this.ensureSummaryShape(body.trim(), branch, baseBranch, findingCount);
    } catch {
      // Fallback below.
    }

    return this.ensureSummaryShape('', branch, baseBranch, findingCount);
  }

  private ensureSummaryShape(body: string, branch: string, baseBranch: string, findingCount: number): string {
    if (body.includes('## Overview') && body.includes('## Review Checklist')) return body;

    return `# Pull Request Summary\n\n## Overview\n\n${body || `Review changes from \`${branch}\` against \`${baseBranch}\`.`}\n\n## What Changed\n\n- Review the branch diff and confirm intended behavior.\n- Validate that code changes are consistent with project standards.\n\n## Files and Areas Impacted\n\n- Derived from the Git diff used by Git Code Review.\n\n## Technical Risks\n\n- Review findings recorded in the current session: ${findingCount}.\n- Confirm pending findings before approving the PR.\n\n## Review Checklist\n\n- [ ] Code behavior is correct.\n- [ ] Tests were added or updated when needed.\n- [ ] Security and validation risks were reviewed.\n- [ ] Architecture and maintainability were reviewed.\n- [ ] Pending findings were resolved or explicitly accepted.\n\n## Testing Notes\n\n- Add manual or automated testing evidence here.\n\n## Reviewer Notes\n\nAI suggestions are advisory. The final approval decision belongs to the code reviewer.\n`;
  }
}
