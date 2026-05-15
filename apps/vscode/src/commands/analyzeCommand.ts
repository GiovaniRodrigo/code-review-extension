import { VSCodeContainer } from '../dependencies/buildContainer';

export const analyzeCommand = {
  id: 'code-review.analyze',
  async execute(container: VSCodeContainer) {
    try {
      const code = await container.ide.getActiveFileContent();
      const filePath = await container.ide.getActiveFilePath();
      const branch = await container.ide.getActiveBranch();
      
      const result = await container.revalidateCodeReviewUseCase.execute({
        code,
        filePath,
        branch
      });

      await container.reviewPanelProvider.refresh();
      await container.notifications.info(`AI analysis completed: ${result.findings.length} finding(s) synced.`);
    } catch (e: any) {
      await container.notifications.error(`Failed to analyze: ${e.message}`);
    }
  }
};
