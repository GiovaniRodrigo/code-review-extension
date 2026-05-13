import { AstBuildResult, AstNodeSummary } from './AstBuilder';

export type StaticRuleSeverity = 'info' | 'warning' | 'error';

export interface StaticRuleFinding {
  ruleId: string;
  message: string;
  severity: StaticRuleSeverity;
  file: string;
  line: number;
  target: string;
}

export interface StaticRuleContext {
  ast: AstBuildResult;
}

export interface StaticRule {
  id: string;
  description: string;
  enabled: boolean;
  run(context: StaticRuleContext): StaticRuleFinding[];
}

export class StaticRuleEngine {
  constructor(private readonly rules: StaticRule[] = createDefaultStaticRules()) {}

  run(ast: AstBuildResult, enabledRuleIds?: string[]): StaticRuleFinding[] {
    const enabled = new Set(enabledRuleIds || this.rules.filter(rule => rule.enabled).map(rule => rule.id));

    return this.rules
      .filter(rule => enabled.has(rule.id))
      .flatMap(rule => rule.run({ ast }));
  }
}

export function createDefaultStaticRules(): StaticRule[] {
  return [
    {
      id: 'max-class-members',
      description: 'Warn when a class has too many members.',
      enabled: true,
      run: ({ ast }) => ast.root.children
        .filter(node => node.kind === 'class' && node.children.length > 8)
        .map(node => ({
          ruleId: 'max-class-members',
          message: `Class ${node.name} has ${node.children.length} members.`,
          severity: 'warning',
          file: ast.filePath,
          line: node.startLine,
          target: node.name
        }))
    },
    {
      id: 'max-file-functions',
      description: 'Warn when a file exposes many top-level functions.',
      enabled: true,
      run: ({ ast }) => {
        const functions = ast.root.children.filter(node => node.kind === 'function');
        if (functions.length <= 10) {
          return [];
        }

        return [{
          ruleId: 'max-file-functions',
          message: `File has ${functions.length} top-level functions.`,
          severity: 'warning',
          file: ast.filePath,
          line: functions[0].startLine,
          target: ast.filePath
        }];
      }
    },
    {
      id: 'missing-structure',
      description: 'Inform when no known structural nodes were found.',
      enabled: true,
      run: ({ ast }) => {
        if (ast.root.children.length > 0) {
          return [];
        }

        return [{
          ruleId: 'missing-structure',
          message: 'No imports, exports, classes, interfaces, functions, or variables were detected.',
          severity: 'info',
          file: ast.filePath,
          line: 1,
          target: ast.filePath
        }];
      }
    }
  ];
}

export function flattenAstNodes(root: AstNodeSummary): AstNodeSummary[] {
  return [root, ...root.children.flatMap(child => flattenAstNodes(child))];
}
