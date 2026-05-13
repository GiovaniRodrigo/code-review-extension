import { Finding, ReviewSession } from '@code-review/domain';
import { AIProvider, IDEAdapter, ReviewRepository } from '@code-review/infra';
import { SeverityEngine } from './SeverityEngine';
import { ContextEngine } from './ContextEngine';

export class AnalyzeCodeUseCase {
  constructor(
    private aiProvider: AIProvider,
    private ideAdapter: IDEAdapter,
    private repository: ReviewRepository,
    private contextEngine: ContextEngine,
    private severityEngine = new SeverityEngine()
  ) {}

  async execute(): Promise<ReviewSession> {
    const code = await this.ideAdapter.getActiveFileContent();
    const filePath = await this.ideAdapter.getActiveFilePath();
    const branch = await this.ideAdapter.getActiveBranch();

    if (!filePath) {
      throw new Error('No active file selected for analysis. Please open a file in the editor and try again.');
    }

    if (!code.trim()) {
      throw new Error('The active file is empty. Please add some code and try again.');
    }

    const context = await this.contextEngine.buildContext(filePath);
    
    const analysisResult = await this.aiProvider.analyzeCode({
      code,
      filePath,
      language: this._detectLanguage(filePath),
      context
    });
    
    const findings: Finding[] = analysisResult.findings.map((p, index) => ({
      id: `${Date.now()}-${index}`,
      file: p.file || filePath,
      line: p.line || 0,
      message: p.message || '',
      severity: this.severityEngine.classify({
        severity: p.severity,
        message: p.message,
        suggestedFix: p.suggestedFix,
        confidenceScore: analysisResult.confidenceScore
      }),
      status: 'pending',
      suggestedFix: p.suggestedFix,
      confidenceScore: analysisResult.confidenceScore
    }));

    const session: ReviewSession = {
      id: Date.now().toString(),
      branch,
      findings,
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.repository.saveSession(session);
    return session;
  }

  private _detectLanguage(filePath: string): string {
    const ext = filePath.split('.').pop();
    switch (ext) {
      case 'ts': return 'typescript';
      case 'js': return 'javascript';
      case 'py': return 'python';
      default: return 'text';
    }
  }
}
