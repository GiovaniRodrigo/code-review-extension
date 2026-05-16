import { StaticRule, StaticRuleFinding } from './StaticRuleEngine';
import { flattenAstNodes } from './shared/astUtils';
export interface CustomRuleConfig {
  id: string;
  description: string;
  severity: 'info' | 'warning' | 'error';
  pattern?: string; // Regex for node name
  kind?: string;    // AST node kind (class, function, etc)
  forbiddenImport?: string; // Regex for import source
  prompt?: string;  // Natural language description for AI to verify
}

export class CustomRuleProvider {
  static fromConfigs(configs: CustomRuleConfig[], llmEvaluator?: (prompt: string, code: string) => Promise<StaticRuleFinding[]>): StaticRule[] {
    return configs.map(config => ({
      id: config.id,
      description: config.description,
      enabled: true,
      run: async ({ ast }) => {
        const findings: StaticRuleFinding[] = [];
        
        if (config.prompt && llmEvaluator) {
            const llmFindings = await llmEvaluator(config.prompt, ast.code);
            // Enrich with rule metadata
            llmFindings.forEach(f => {
                f.ruleId = config.id;
                f.severity = config.severity;
                findings.push(f);
            });
        }

        const allNodes = flattenAstNodes(ast.root);

        if (config.forbiddenImport) {
          const regex = new RegExp(config.forbiddenImport);
          allNodes
            .filter(node => node.kind === 'import' && regex.test(node.name))
            .forEach(node => {
              findings.push({
                ruleId: config.id,
                message: config.description,
                severity: config.severity,
                file: ast.filePath,
                line: node.startLine,
                target: node.name
              });
            });
        }

        if (config.kind || config.pattern) {
          allNodes
            .filter(node => {
                const kindMatch = config.kind ? node.kind === config.kind : true;
                const patternMatch = config.pattern ? new RegExp(config.pattern).test(node.name) : true;
                return kindMatch && patternMatch;
            })
            .forEach(node => {
                // If it's a sourceFile and we matched by pattern, it's a file-level rule
                if (node.kind === 'sourceFile' && !config.pattern) return; 

                findings.push({
                    ruleId: config.id,
                    message: config.description,
                    severity: config.severity,
                    file: ast.filePath,
                    line: node.startLine,
                    target: node.name
                });
            });
        }

        return findings;
      }
    }));
  }
}
