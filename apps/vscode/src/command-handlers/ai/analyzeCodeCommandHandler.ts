import { VSCodeContainer } from '../../dependencies/buildContainer';

export class AnalyzeCodeCommandHandler {
  constructor(private readonly container: VSCodeContainer) {}

  async handle(): Promise<void> {
    const code = await this.container.ide.getActiveFileContent();
    const filePath = await this.container.ide.getActiveFilePath();
    const result = await this.container.analyzeCodeWithAIUseCase.execute({
      code,
      filePath,
      mode: 'fast'
    });

    await this.container.notifications.info(
      `AI analysis completed: ${result.findings.length} finding(s).`
    );
  }
}
