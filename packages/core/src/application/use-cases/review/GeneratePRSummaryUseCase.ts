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

    const approvedFindings = session?.findings.filter(f => f.status === 'approved') || [];
    
    const findingsContext = approvedFindings.map(f => `- ${f.file}:${f.line}: ${f.message}`).join('\n');

    const prompt = `
Generate a Pull Request description based on the following code changes and approved code review findings.

CHANGES (Diff):
${diff.substring(0, 15000)}

APPROVED FINDINGS:
${findingsContext}

The description should follow this structure:
1. **Summary**: A high-level overview of the changes.
2. **What's changed**: A bulleted list of key changes.
3. **Technical Risks & Quality**: Mention any approved findings that indicate risks or areas of note.
4. **Testing Done**: (Placeholder for user to fill).

Return only the Markdown description.
`;

    const response = await this.aiProvider.analyzeCode({
        code: prompt,
        filePath: 'pr-summary-request',
        mode: 'standard'
    });

    // We use the AI response as the body. 
    // Since our AIProvider currently returns structured findings, 
    // we might need a separate method for free-text generation or adapt it.
    // For now, let's assume the AI response finding message contains the summary if we adapt the prompt.
    
    const summaryMarkdown = response.findings.length > 0 
        ? response.findings[0].message 
        : 'Could not generate summary.';

    return {
      title: `Review: ${branch}`,
      markdown: summaryMarkdown
    };
  }
}
