import { VSCodeContainer } from '../dependencies/buildContainer';

export const analyzeCommand = {
  id: 'code-review.analyze',
  async execute(container: VSCodeContainer) {
    try {
      const code = await container.ide.getActiveFileContent();
      const filePath = await container.ide.getActiveFilePath();
      const result = await container.analyzeCodeWithAIUseCase.execute({
        code,
        filePath,
        mode: 'fast'
      });
      await container.notifications.info(`AI analysis completed: ${result.findings.length} finding(s).`);
    } catch (e: any) {
      await container.notifications.error(`Failed to analyze: ${e.message}`);
    }
  }
};
