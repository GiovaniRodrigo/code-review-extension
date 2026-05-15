import { VSCodeContainer } from '../dependencies/buildContainer';

export const analyzeCommand = {
  id: 'code-review.analyze',
  async execute(container: VSCodeContainer) {
    try {
      const code = await container.ide.getActiveFileContent();
      const filePath = await container.ide.getActiveFilePath();
      const branch = await container.ide.getActiveBranch();
      
      const result = await container.analyzeCodeWithAIUseCase.execute({
        code,
        filePath,
        mode: 'fast'
      });

      const findings = result.findings.map((f, index) => ({
        id: `ai-${Date.now()}-${index}`,
        file: f.file,
        line: f.line,
        column: f.column,
        message: f.message,
        severity: f.severity as any,
        status: 'pending' as any,
        confidenceScore: f.confidence,
        suggestedFix: f.suggestedFix
      }));

      await container.createCodeReviewUseCase.execute(branch, findings);
      await container.reviewPanelProvider.refresh();

      await container.notifications.info(`AI analysis completed: ${findings.length} finding(s) added to session.`);
    } catch (e: any) {
      await container.notifications.error(`Failed to analyze: ${e.message}`);
    }
  }
};
