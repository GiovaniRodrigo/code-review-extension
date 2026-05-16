import { AstBuilder } from '../../../AstBuilder';
import { StaticRuleEngine, StaticRuleFinding } from '../../../StaticRuleEngine';
import { FileRiskScore, RiskScorer } from '../../../RiskScorer';
import { IdeAdapterPort } from '../../../ports/ide/IdeAdapterPort';

export interface TechnicalAnalysisReport {
  filePath: string;
  language: string;
  risk: FileRiskScore;
  staticFindings: StaticRuleFinding[];
}

export class RunTechnicalAnalysisUseCase {
  constructor(
    private readonly ideAdapter: IdeAdapterPort,
    private readonly astBuilder = new AstBuilder(),
    private readonly ruleEngine = new StaticRuleEngine(),
    private readonly riskScorer = new RiskScorer()
  ) {}

  async execute(): Promise<TechnicalAnalysisReport> {
    const filePath = await this.ideAdapter.getActiveFilePath();
    const code = await this.ideAdapter.getActiveFileContent();

    if (!filePath || !code) {
      throw new Error('No active file or content to analyze.');
    }

    const ast = this.astBuilder.build({ filePath, code });
    const staticFindings = await this.ruleEngine.run(ast);
    const risk = this.riskScorer.score(ast, staticFindings);

    return {
      filePath,
      language: ast.language,
      risk,
      staticFindings
    };
  }
}
