import { IdeWorkspacePort } from '../../../ports/ide/IdeWorkspacePort';
import { IdeFileSystemPort } from '../../../ports/ide/IdeFileSystemPort';
import { CustomRuleProvider, CustomRuleConfig } from '../../../CustomRuleProvider';
import { StaticRuleEngine } from '../../../StaticRuleEngine';
import { AIAnalysisService } from '../../services/ai/AIAnalysisService';

export class LoadCustomHeuristicsUseCase {
  constructor(
    private readonly workspace: IdeWorkspacePort,
    private readonly fileSystem: IdeFileSystemPort,
    private readonly ruleEngine: StaticRuleEngine,
    private readonly analysisService?: AIAnalysisService
  ) {}

  async execute(): Promise<void> {
    const configPath = 'code-review.heuristics.json';
    const exists = await this.fileSystem.exists(configPath);
    
    if (!exists) return;

    try {
      const content = await this.fileSystem.readFile(configPath);
      const config = JSON.parse(content) as { rules: CustomRuleConfig[] };
      
      if (config.rules && Array.isArray(config.rules)) {
        const evaluator = this.analysisService 
            ? (prompt: string, code: string) => this.analysisService!.evaluateRule(prompt, code)
            : undefined;

        const customRules = CustomRuleProvider.fromConfigs(config.rules, evaluator);
        this.ruleEngine.addRules(customRules);
        console.log(`[HEURISTICS] Loaded ${customRules.length} custom rules from ${configPath}`);
      }
    } catch (e: any) {
      console.error(`[HEURISTICS] Failed to load custom heuristics: ${e.message}`);
    }
  }
}
