import { AstBuilder } from '../../../AstBuilder';
import { StaticRuleEngine, StaticRuleFinding } from '../../../StaticRuleEngine';
import { FileRiskScore, RiskScorer } from '../../../RiskScorer';
import { TestabilityScore, TestabilityScorer } from '../../../TestabilityScorer';
import { IdeAdapterPort } from '../../../ports/ide/IdeAdapterPort';

export interface TechnicalAnalysisReport {
  filePath: string;
  language: string;
  risk: FileRiskScore;
  testability: TestabilityScore;
  staticFindings: StaticRuleFinding[];
}

export class RunTechnicalAnalysisUseCase {
  constructor(
    private readonly ideAdapter: IdeAdapterPort,
    private readonly astBuilder = new AstBuilder(),
    private readonly ruleEngine = new StaticRuleEngine(),
    private readonly riskScorer = new RiskScorer(),
    private readonly testabilityScorer = new TestabilityScorer()
  ) {}

  async execute(): Promise<TechnicalAnalysisReport> {
    const filePath = await this.ideAdapter.getActiveFilePath();
    const code = await this.ideAdapter.getActiveFileContent();

    if (!filePath || !code) {
      throw new Error('No active file or content to analyze.');
    }

    const ast = await this.astBuilder.build({ filePath, code });
    const staticFindings = await this.ruleEngine.run(ast);
    const risk = this.riskScorer.score(ast, staticFindings);
    const testability = this.testabilityScorer.calculate(ast);

    return {
      filePath,
      language: ast.language,
      risk,
      testability,
      staticFindings
    };
  }
}

