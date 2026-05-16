import { ReviewSession } from '@code-review/domain';
import { AIAnalysisService } from '../../services/ai/AIAnalysisService';
import { CodeReviewRepositoryPort } from '../../../ports/review/CodeReviewRepositoryPort';
import { IdeAdapterPort } from '../../../ports/ide/IdeAdapterPort';

export interface RefactorFindingInput {
  sessionId: string;
  findingId: string;
}

export class RefactorFindingUseCase {
  constructor(
    private readonly repository: CodeReviewRepositoryPort,
    private readonly aiService: AIAnalysisService,
    private readonly ide: IdeAdapterPort
  ) {}

  async execute(input: RefactorFindingInput): Promise<void> {
    const session = await this.repository.getSessionById(input.sessionId);
    if (!session) throw new Error(`Session ${input.sessionId} not found`);

    const finding = session.findings.find(f => f.id === input.findingId);
    if (!finding) throw new Error(`Finding ${input.findingId} not found`);

    const code = await this.ide.getActiveFileContent();
    if (!code) throw new Error('Could not read current file content.');

    const refactoredCode = await this.aiService.generateRefactor(finding, code);
    
    if (!refactoredCode) {
        throw new Error('AI could not generate a refactoring for this finding.');
    }

    // Temporarily update finding to show the new suggestion
    finding.suggestedFix = refactoredCode;
    finding.status = 'approved'; // Auto-approve if refactored? Or keep pending?
    
    await this.repository.saveSession(session);
    await this.ide.applyFix(finding);
  }
}
