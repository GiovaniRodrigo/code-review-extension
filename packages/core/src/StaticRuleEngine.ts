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
      id: 'long-method',
      description: 'Warn when a method or function is too long.',
      enabled: true,
      run: ({ ast }) => {
        const allNodes = flattenAstNodes(ast.root);
        return allNodes
          .filter(node => (node.kind === 'method' || node.kind === 'function'))
          .filter(node => (node.endLine - node.startLine + 1) > 40)
          .map(node => ({
            ruleId: 'long-method',
            message: `${node.kind === 'method' ? 'Method' : 'Function'} ${node.name} is too long (${node.endLine - node.startLine + 1} lines).`,
            severity: 'warning',
            file: ast.filePath,
            line: node.startLine,
            target: node.name
          }));
      }
    },
    {
      id: 'too-many-params',
      description: 'Warn when a method or function has too many parameters.',
      enabled: true,
      run: ({ ast }) => {
        const allNodes = flattenAstNodes(ast.root);
        return allNodes
          .filter(node => (node.kind === 'method' || node.kind === 'function'))
          .filter(node => node.metadata?.parameters > 4)
          .map(node => ({
            ruleId: 'too-many-params',
            message: `${node.kind === 'method' ? 'Method' : 'Function'} ${node.name} has too many parameters (${node.metadata.parameters}).`,
            severity: 'warning',
            file: ast.filePath,
            line: node.startLine,
            target: node.name
          }));
      }
    },
    {
      id: 'architectural-dip',
      description: 'Warn when application layer depends on infrastructure directly.',
      enabled: true,
      run: ({ ast }) => {
        if (!ast.filePath.includes('application')) return [];

        return ast.root.children
          .filter(node => node.kind === 'import')
          .filter(node => node.name.includes('/infra/') || node.name.includes('@code-review/infra'))
          .map(node => ({
            ruleId: 'architectural-dip',
            message: `Dependency Inversion violation: Application layer should not import from infrastructure directly (${node.name}).`,
            severity: 'error',
            file: ast.filePath,
            line: node.startLine,
            target: node.name
          }));
      }
    },
    {
      id: 'max-interface-methods',
      description: 'Warn when an interface has too many methods (ISP violation).',
      enabled: true,
      run: ({ ast }) => ast.root.children
        .filter(node => node.kind === 'interface' && node.children.length > 5)
        .map(node => ({
          ruleId: 'max-interface-methods',
          message: `Interface ${node.name} has ${node.children.length} methods. Consider splitting it (ISP).`,
          severity: 'warning',
          file: ast.filePath,
          line: node.startLine,
          target: node.name
        }))
    },
    {
      id: 'cyclomatic-complexity',
      description: 'Warn when a method or function is too complex.',
      enabled: true,
      run: ({ ast }) => {
        const allNodes = flattenAstNodes(ast.root);
        return allNodes
          .filter(node => (node.kind === 'method' || node.kind === 'function'))
          .map(node => {
            const complexity = node.metadata?.complexity || 1;
            if (complexity > 10) {
              return {
                ruleId: 'cyclomatic-complexity',
                message: `${node.kind === 'method' ? 'Method' : 'Function'} ${node.name} has high complexity (${complexity}). Consider refactoring.`,
                severity: 'warning' as const,
                file: ast.filePath,
                line: node.startLine,
                target: node.name
              };
            }
            return null;
          })
          .filter((f): f is StaticRuleFinding => f !== null);
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
